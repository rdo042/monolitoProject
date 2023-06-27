import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should process a checkout", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                orderId: "1",
                amount: 10,
            });

        expect(response.status).toBe(200);
        
    });

    it("should not process a checkout", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                orderId: "2",
            });

        expect(response.status).toBe(500);

    });

});