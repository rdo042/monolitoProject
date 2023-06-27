import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                id: "1",
                name: "Client 1",
                email: "client@teste.com",
                document: "Doc 1",
                street: "Street 1",
                number: "10",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "000",
            });

        expect(response.status).toBe(200);
        
    });

    it("should not create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                zipcode: "000",
            });

        expect(response.status).toBe(500);

    });

    it("should find a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                id: "1",
                name: "Client 1",
                email: "client@teste.com",
                document: "Doc 1",
                street: "Street 1",
                number: "10",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "000",
        });

        expect(response.status).toBe(200);

        const findResponse = await request(app).get("/clients").send(
            {
                clientId: "1", 
            }
        );

        expect(findResponse.status).toBe(200);
        const client = findResponse.body;
        expect(client.id).toBe("1");
        expect(client.name).toBe("Client 1");
        expect(client.email).toBe("client@teste.com");
        expect(client.document).toBe("Doc 1");
        expect(client.street).toBe("Street 1");
        expect(client.number).toBe("10");
        expect(client.complement).toBe("Complement 1");
        expect(client.city).toBe("City 1");
        expect(client.state).toBe("State 1");
        expect(client.zipCode).toBe("000");

    });
});