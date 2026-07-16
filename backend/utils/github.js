const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const githubToken = process.env.GITHUB_TOKEN;
const repoOwner = process.env.REPO_OWNER;
const repoName = process.env.REPO_NAME;

const githubClient = axios.create({
  baseURL: GITHUB_API,
  headers: {
    Authorization: `token ${githubToken}`,
    'Content-Type': 'application/json',
  },
});

// Pobierz zawartość pliku z GitHub
const getFileContent = async (filePath) => {
  try {
    const response = await githubClient.get(
      `/repos/${repoOwner}/${repoName}/contents/${filePath}`
    );
    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    return {
      data: JSON.parse(content),
      sha: response.data.sha,
    };
  } catch (error) {
    console.error(`Błąd pobierania ${filePath}:`, error.message);
    throw error;
  }
};

// Zapisz zawartość pliku na GitHub
const updateFileContent = async (filePath, content, message) => {
  try {
    const currentFile = await getFileContent(filePath);
    const response = await githubClient.put(
      `/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha: currentFile.sha,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Błąd zapisywania ${filePath}:`, error.message);
    throw error;
  }
};

// Utwórz nowy plik na GitHub
const createFileContent = async (filePath, content, message) => {
  try {
    const response = await githubClient.put(
      `/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 422) {
      // Plik już istnieje, spróbuj update
      return updateFileContent(filePath, content, message);
    }
    console.error(`Błąd tworzenia ${filePath}:`, error.message);
    throw error;
  }
};

module.exports = {
  getFileContent,
  updateFileContent,
  createFileContent,
};
