function sendMail() {
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_a9wr65h", "template_k02wzul", parms).then(
    function (response) {
      alert("Message envoyé !");
    },
    function (error) {
      alert("Erreur lors de l'envoi : " + error);
    }
  );
}
