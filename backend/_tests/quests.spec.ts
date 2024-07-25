import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { QuestResolver } from "../src/resolvers/Quests";
import { Difficulty, QuestCreateInput } from "../src/entities/Quest";
import { AuthChecker, buildSchema } from "type-graphql";
import { graphql } from "graphql";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../src/datasource";
import { GraphQLSchema } from "graphql";
import jwt from "jsonwebtoken";
import { ContextType } from "../src/auth";
import { User } from "../src/entities/User";

export interface JwtPayload {
  userId: string;
}

// Signer un jeton JWT avec l'ID de l'utilisateur
function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, "secret");
}

// Fonction pour simuler un utilisateur connecté
export const customAuthChecker: AuthChecker<ContextType> = ({ context }) => {
  const { authToken } = context;

  if (!authToken) {
    return false;
  }

  try {
    const decodedToken = jwt.verify(authToken, "secret") as JwtPayload;
    context.user = {
      id: parseInt(decodedToken.userId, 10),
      firstname: "Test",
      lastname: "User",
      nickname: "testuser",
      email: "testuser@example.com",
    } as any;
    return true;
  } catch (error) {
    return false;
  }
};

let dataSource: DataSource;
let schema: GraphQLSchema;
let authToken: string;
let fakeUser: User;

beforeAll(async () => {
  dataSource = new DataSource({
    ...dataSourceOptions,
    host: "127.0.0.1",
    port: 5571,
    username: "postgres",
    password: "pgpassword",
    database: "postgres",
    dropSchema: true,
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  schema = await buildSchema({
    resolvers: [QuestResolver],
    authChecker: customAuthChecker,
  });

  // Créer un utilisateur fictif dans la base de données
  fakeUser = await User.create({
    firstname: "Test",
    lastname: "User",
    nickname: "testuser",
    email: "testuser@example.com",
    hashedPassword: "hashedPassword",
    createdAt: new Date(),
    isAdmin: false,
  }).save();

  authToken = generateAuthToken(fakeUser.id.toString());
});

describe("create a new quest", () => {
  let createdQuestId: number;

  it("should create a new quest", async () => {
    const data: QuestCreateInput = {
      title: "Test Quest",
      description: "Description d'une quête test",
      startDate: new Date(),
      duration: 10,
      difficulty: Difficulty.EASY,
      missions: [],
      users: [],
      code: 123456,
    };

    const response = await graphql({
      schema,
      source: `
        mutation CreateQuest($data: QuestCreateInput!) {
          createQuest(data: $data) {
            id
            title
            startDate
            duration
            difficulty
            code
          }
        }
      `,
      variableValues: { data },
      contextValue: {
        authToken,
        user: fakeUser,
      } as ContextType,
    });

    if (response.errors) {
      console.error("GraphQL Errors:", response.errors);
    }

    const createQuest: any = response.data?.createQuest;
    createdQuestId = createQuest?.id;

    expect(createQuest).toBeDefined();
    expect(createQuest).toHaveProperty("id");
    expect(createQuest).toHaveProperty("title", data.title);
    expect(createQuest).toHaveProperty(
      "startDate",
      data.startDate.toISOString()
    );
    expect(createQuest).toHaveProperty("duration", data.duration);
    expect(createQuest).toHaveProperty("difficulty", data.difficulty);
    expect(createQuest).toHaveProperty("code");
  });

  it("should find the created quest by its ID", async () => {
    const response = await graphql({
      schema,
      source: `
        query getQuestById($Id: ID!) {
          getQuestById(id: $Id) {
            id
            title
          }
        }
      `,
      variableValues: { Id: createdQuestId },
      contextValue: {
        authToken,
        user: fakeUser,
      } as ContextType,
    });

    if (response.errors) {
      console.error("GraphQL Errors:", response.errors);
    }

    const foundQuest = response.data?.getQuestById;

    expect(foundQuest).toBeDefined();
    expect(foundQuest).toHaveProperty("id", createdQuestId);
  });
});

afterAll(() => dataSource.destroy());
