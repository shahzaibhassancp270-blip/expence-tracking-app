// Storage is not enabled on this project.
// Receipt image uploads are disabled.
export const storageService = {
  uploadReceipt: async () => {
    throw new Error('Storage is not enabled. Image uploads are disabled.');
  }
};
