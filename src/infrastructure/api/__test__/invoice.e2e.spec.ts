import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import Product from "../../../modules/invoice/domain/entity/product.entity";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

        it("should not generate a invoice", async () => {
        const response = await request(app)
            .post("/invoice")
            .send({
                city: "City 1",
            });

        expect(response.status).toBe(500);

    });

    it("should find invoice by Id", async () => {
        const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
        const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});
        const products = [item1, item2];
        
        const response = await request(app)
            .post("/invoice")
            .send({
                id: "1",
                name: "Name 1",
                document: "Doc 1",
                street: "Street 1",
                number: "1",
                complement: "",
                city: "City 1",
                state: "State 1",
                zipCode: "000",
                items: products.map((product) => ({
                    id: product.id.id,
                    name: product.name,
                    price: product.price
                  })),
            });

        expect(response.status).toBe(200);

        const findResponse = await request(app).get("/invoice").send(
            {
                id: '1' 
            }
        );

        expect(findResponse.status).toBe(200);
        const invoice = findResponse.body;
        expect(invoice.id).toBe("1");
        expect(invoice.name).toBe("Name 1");

    });
});