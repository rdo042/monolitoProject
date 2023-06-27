import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 10,
                stock: 10,
            });

        expect(response.status).toBe(200);
        
    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                stock: "",
            });

        expect(response.status).toBe(500);

    });

    it("should checkStock a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                id: "1",
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 10,
                stock: 10,
        });

        expect(response.status).toBe(200);

        const checkStockResponse = await request(app).get("/products/checkStock").send(
            {
                productId: "1", 
            }
        );

        expect(checkStockResponse.status).toBe(200);
        const product = checkStockResponse.body;
        expect(product.productId).toBe("1");
        expect(product.stock).toBe(10);

    });
});