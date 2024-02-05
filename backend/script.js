const form = document.getElementById("form");
const fetch = require('node-fetch');

form.addEventListener("submit", submitForm);

async function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();

    formData.append("name", name.value);

    for (let i = 0; i < files.files.length; i++) {
        formData.append("file[]", files.files[i]);
    }
    

    const url = 'http://localhost:5000/upload_files';

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
