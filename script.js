function generateImage() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const imageUpload = document.getElementById("imageUpload").files[0];
    const nameInput = document.getElementById("nameInput").value.trim();

    if (!imageUpload || !nameInput) {
        alert("Please upload an image and enter your name.");
        return;
    }

    // Hide heading and description
    document.getElementById("heading").style.display = "none";
    document.getElementById("description").style.display = "none";

    // Hide form fields and "Generate Image" button
    document.getElementById("form-container").style.display = "none";

    // Always use the student template
    const template = new Image();
    template.src = "student-template.png";

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
        img.src = event.target.result;
    };

    img.onload = function() {
        template.onload = function() {
            canvas.width = template.width;
            canvas.height = template.height;

            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // Profile Photo Position & Size
            const photoX = 819, photoY = 890, photoWidth = 520, photoHeight = 520;
            const radius = photoWidth / 2;

            // Crop to square to ensure image fills without distortion
            let srcX = 0, srcY = 0, srcSize = 0;
            if (img.width > img.height) {
                srcSize = img.height;
                srcX = (img.width - img.height) / 2;
            } else {
                srcSize = img.width;
                srcY = (img.height - img.width) / 2;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + radius, photoY + radius, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw cropped image so it fills the circle
            ctx.drawImage(img, srcX, srcY, srcSize, srcSize, photoX, photoY, photoWidth, photoHeight);
            ctx.restore();

            ctx.fillStyle = "white";
            ctx.font = "80px 'Inter Light', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(nameInput, canvas.width / 2, photoY + photoHeight + 152);

            const dataURL = canvas.toDataURL("image/png");
            document.getElementById("preview").src = dataURL;
            document.getElementById("preview").style.display = "block";

            document.getElementById("downloadLink").href = dataURL;
            document.getElementById("downloadLink").download = `basecamp-${nameInput.replace(/\s+/g, '_')}.png`;
            document.getElementById("downloadLink").style.display = "inline-block";
            document.getElementById("resetButton").style.display = "inline-block";
        };
    };

    reader.readAsDataURL(imageUpload);
}

function resetPage() {
    document.getElementById("heading").style.display = "block";
    document.getElementById("description").style.display = "block";
    document.getElementById("form-container").style.display = "block";

    document.getElementById("preview").style.display = "none";
    document.getElementById("downloadLink").style.display = "none";
    document.getElementById("resetButton").style.display = "none";

    document.getElementById("imageUpload").value = "";
    document.getElementById("nameInput").value = "";

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}