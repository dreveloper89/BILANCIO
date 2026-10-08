import type { FamilyBudgetData, Transaction } from '../types';

export const DRIVE_FILE_NAME = 'risparmio_famigliare_dati.json';

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime?: string;
  size?: string;
}

/**
 * Search for the family budget file on Google Drive
 */
export async function findBudgetFileOnDrive(accessToken: string): Promise<DriveFileInfo | null> {
  const query = encodeURIComponent(`name = '${DRIVE_FILE_NAME}' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)&pageSize=1`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore ricerca Google Drive (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0] as DriveFileInfo;
  }
  return null;
}

/**
 * Download budget data JSON from Google Drive
 */
export async function downloadBudgetFileFromDrive(accessToken: string, fileId: string): Promise<FamilyBudgetData> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore scaricamento da Google Drive (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  return json as FamilyBudgetData;
}

/**
 * Upload or update the budget data JSON on Google Drive
 */
export async function saveBudgetFileToDrive(
  accessToken: string,
  data: FamilyBudgetData,
  existingFileId?: string | null
): Promise<{ fileId: string; modifiedTime: string }> {
  const fileContent = JSON.stringify(data, null, 2);

  if (existingFileId) {
    // Update existing file content
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`;
    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: fileContent,
    });

    if (!response.ok) {
      // If 404, file might have been deleted on Drive, try recreating
      if (response.status === 404) {
        return createNewBudgetFileOnDrive(accessToken, data);
      }
      const errorText = await response.text();
      throw new Error(`Errore aggiornamento file su Google Drive (${response.status}): ${errorText}`);
    }

    const updatedFile = await response.json();
    return {
      fileId: updatedFile.id || existingFileId,
      modifiedTime: new Date().toISOString(),
    };
  } else {
    // Check first if file already exists before creating a duplicate
    const existing = await findBudgetFileOnDrive(accessToken);
    if (existing) {
      return saveBudgetFileToDrive(accessToken, data, existing.id);
    }
    return createNewBudgetFileOnDrive(accessToken, data);
  }
}

/**
 * Create a new file with metadata on Google Drive using multipart upload
 */
async function createNewBudgetFileOnDrive(
  accessToken: string,
  data: FamilyBudgetData
): Promise<{ fileId: string; modifiedTime: string }> {
  const metadata = {
    name: DRIVE_FILE_NAME,
    mimeType: 'application/json',
    description: 'Archivio Gestione Risparmio Famigliare - Sincronizzato con dreiu89@gmail.com',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(data, null, 2) +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore creazione file su Google Drive (${response.status}): ${errorText}`);
  }

  const createdFile = await response.json();
  return {
    fileId: createdFile.id,
    modifiedTime: new Date().toISOString(),
  };
}

/**
 * Format CSV string for family budget transactions export
 */
export function generateBudgetCSV(transactions: Transaction[]): string {
  const headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descrizione', 'Importo (€)', 'Pagato da', 'Note'];
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type === 'income' ? 'Entrata' : 'Uscita'}"`,
    `"${t.category}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    `"${(t.payer || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
}

/**
 * Download CSV file in the browser
 */
export function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
