import ValidatorInterface from "../../@shared/validator/validator.interface";
import Client from "../domain/client.entity";
import ClientYupValidator from "../validator/client.yup.validator";

export default class ClientValidatorFactory {
    static create(): ValidatorInterface<Client> {
        return new ClientYupValidator();
    }
}