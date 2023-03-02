const successEmail = (resetToken, email) => {
    return `
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para recuperar la contraseña de tu cuenta.</p>
        <p>Para continuar, haz clic en el siguiente enlace:</p>
        <p><a href="http://localhost:5173/login?token=${resetToken}&email=${email}">Recuperar Contraseña</a></p>
        <p>Si no solicitaste esta recuperación, por favor ignora este mensaje.</p>
    `
}

module.exports = { successEmail }