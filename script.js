// Remove the token from the code
const huggingFaceToken = "YOUR_HUGGING_FACE_TOKEN"; // <-- Remove or replace this

const inputText = document.getElementById("in");
const img = document.getElementById("image");
const BTN = document.getElementById("btn");
const download = document.getElementById("Download");
const reset = document.getElementById("Reset");

async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}

async function generate() {
    if (inputText.value.trim() === "") {
        alert("Please enter a prompt before generating an image!");
        return;
    }

    query({ "inputs": inputText.value }).then((response) => {
        if (response) {
            const objectUrl = URL.createObjectURL(response);
            img.src = objectUrl;
        } else {
            console.log("No image received.");
        }
    });
}

BTN.addEventListener("click", generate);

inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generate();
    }
});

reset.addEventListener("click", () => {
    inputText.value = "";
    img.src = "photo.svg";
});

download.addEventListener("click", () => {
    if (img.src && img.src !== "photo.svg") {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = "generated-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        console.log("No image available for download.");
    }
});
