import * as yup from "yup";
import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../domain/product.entity";

export default class ProductYupValidator implements ValidatorInterface<Product>
{
    validate(entity: Product): void {

        try {

            yup
            .object()
            .shape({
                name: yup.string().required("Name is required"),
                purchasePrice: yup.number().required().positive("Price must be greater than zero"),
            })
            .validateSync(
                {
                    name: entity.name,
                    purchasePrice: entity.purchasePrice,
                },
                {
                    abortEarly: false,
                }
            );
        } catch(errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: "product",
                    message: error,
                })
            })
        }

    }
        
}