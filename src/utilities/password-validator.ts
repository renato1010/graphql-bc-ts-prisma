import passwordValidator from 'password-validator';

const schema = new passwordValidator();

schema.is().min(8).has().uppercase().has().digits(1).has().not().spaces();

export { schema };
