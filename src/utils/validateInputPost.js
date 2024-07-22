export const validateInputPost = (content, optionalFields = []) => {
    for (let key in content) {
      // Verifica se o campo está na lista de campos opcionais
      if (!optionalFields.includes(key) && (content[key] === "" || content[key] == null)) {
        const error = new Error("Validation Error");
        error.response = {
          data: {
            error: "Por favor preencha todos os campos obrigatórios!",
          },
        };
        throw error;
      }
    }
  };