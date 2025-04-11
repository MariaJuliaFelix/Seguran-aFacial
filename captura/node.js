const form = document.getElementById("userForm");
      const video = document.getElementById("video");
      const captureBtn = document.getElementById("captureBtn");
      const previewContainer = document.getElementById("previewContainer");
      
      let capturedImages = []; // Armazenará as 6 imagens em Base64
      
      // Acessar a câmera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream);
      
      // Capturar imagem
      captureBtn.addEventListener("click", () => {
        if (capturedImages.length >= 6) return alert("Já foram capturadas 6 imagens!");
        
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL("image/jpeg"); // Converte para Base64
        capturedImages.push(imageData);
        
        // Mostrar preview
        const imgPreview = document.createElement("img");
        imgPreview.src = imageData;
        imgPreview.width = 100;
        previewContainer.appendChild(imgPreview);
      });
      
      // Enviar formulário + imagens
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries());
        
        // Objeto final com dados + imagens
        const payload = {
          user: userData,
          images: capturedImages
        };
        
        // Enviar para o backend (Python)
        try {
          const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) alert("Cadastro realizado!");
          else alert("Erro no cadastro.");
        } catch (error) {
          console.error("Erro:", error);
        }
      });