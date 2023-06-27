import * as yup from "yup";
import ValidatorInterface from "../../@shared/validator/validator.interface";
import Client from "../domain/client.entity";


export default class ClientYupValidator implements ValidatorInterface<Client>
{
    validate(entity: Client): void {

        try {

            yup
            .object()
            .shape({
                name: yup.string().required("Name is required"),
                email: yup.string().required("Email is required"),
            })
            .validateSync(
                {
                    name: entity.name,
                    email: entity.email,
                },
                {
                    abortEarly: false,
                }
            );
        } catch(errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: "client",
                    message: error,
                })
            })
        }

    }
        
}