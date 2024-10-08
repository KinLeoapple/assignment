import emailjs from "@emailjs/browser";

export const sendEmail = (to_name, message, to_email) => {
    emailjs.init("okrql5pOHtOF7E81I");
    emailjs.send("service_6b1kjew", "template_jyx81ct", {
        to_name: to_name,
        from_name: "Haojun Huang",
        message: message,
        to_email: to_email,
    })
        .then(function(response) {
            console.log("Success", response.status, response.text);
        }, function(error) {
            console.log("Error", error);
        });
}
