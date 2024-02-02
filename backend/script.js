const form = document.getElementById("form");

form.addEventListener("submit", submitForm);
function submitForm(e) {
    console.log("test2");
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("name", name.value);
    for (let i = 0; i < files.files.length; i++){
        formData.append("file", files.files[i]);
    }
    fetch("http://localhost:5000/upload_files", {
        method: 'POST',
        body: formData
    })
    .then((res) => console.log(res))
    .catch((err) => ("Error occured", err));
}
