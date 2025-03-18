function generateImage() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const imageUpload = document.getElementById("imageUpload").files[0];
    const nameInput = document.getElementById("nameInput").value.trim();
    const role = document.querySelector('input[name="role"]:checked');

    if (!imageUpload || !nameInput || !role) {
        alert("Please upload an image, enter your name, and select your role.");
        return;
    }

    // Get selected role value
    const roleValue = role.value;

    // Hide form fields and "Generate Image" button
    document.getElementById("form-container").style.display = "none";

    // Choose the correct template based on role
    const template = new Image();
    template.src = roleValue === "student" ? "student-template.png" : "teacher-template.png";

    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(event) {
        img.src = event.target.result;
    };

    img.onload = function() {
        template.onload = function() {
            canvas.width = template.width;
            canvas.height = template.height;

            // Draw the template background
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // Position & Size of Profile Photo
            const photoX = 819, photoY = 890, photoWidth = 520, photoHeight = 520;
            const radius = photoWidth / 2;

            ctx.save();
            ctx.beginPath();
            ctx.arc(photoX + radius, photoY + radius, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
            ctx.restore();

            ctx.fillStyle = "white";
            ctx.font = "80px 'Inter Light', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(nameInput, canvas.width / 2, photoY + photoHeight + 152);

            const dataURL = canvas.toDataURL("image/png");
            document.getElementById("preview").src = dataURL;
            document.getElementById("preview").style.display = "block";

            document.getElementById("downloadLink").href = dataURL;
            document.getElementById("downloadLink").download = `basecamp-${nameInput.replace(/\s+/g, '_')}-${roleValue}.png`;
            document.getElementById("downloadLink").style.display = "inline-block";
            document.getElementById("resetButton").style.display = "inline-block";
        };
    };

    reader.readAsDataURL(imageUpload);
}

function resetPage() {
    window.location.reload();
}