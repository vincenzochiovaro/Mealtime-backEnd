const db = require("../db/connection");
const seed = require("../db/seeds/seedData");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("GET /api/categories", () => {
    test("should respond with a status of 200 ", async () => {
      await request(app).get("/api/categories").expect(200);
    });
    test("should respond with a status of 200 and display an array of category objects  ", async () => {
      const categories = await request(app).get("/api/categories").expect(200);
      expect(Array.isArray(categories.body));
      expect(categories.body).toHaveLength(4);
    });
    test("each object should contain id and name property", async () => {
      const categories = await request(app).get("/api/categories").expect(200);
      categories.body.forEach((category) => {
        expect(category).toHaveProperty("id", expect.any(Number));
        expect(category).toHaveProperty("category_name", expect.any(String));
      });
    });
  });

  describe("GET /api/recipes/:category", () => {
    test("should respond with a status of 200", async () => {
      await request(app).get("/api/recipes/pork").expect(200);
      await request(app).get("/api/recipes/beef").expect(200);
      await request(app).get("/api/recipes/chicken").expect(200);
      await request(app).get("/api/recipes/lamb").expect(200);
    });
    test("should respond with a status of 200 and display an array of porkRecipes object  ", async () => {
      const porkRecipes = await request(app)
        .get("/api/recipes/pork")
        .expect(200);
      expect(Array.isArray(porkRecipes.body));
    });
    test("each object should contain id/title/category/instrunctions/image/youtube and ingredients property  ", async () => {
      const porkRecipes = await request(app)
        .get("/api/recipes/pork")
        .expect(200);
      porkRecipes.body.forEach((recipe) => {
        expect(recipe).toHaveProperty("id", expect.any(Number));
        expect(recipe).toHaveProperty("title", expect.any(String));
        expect(recipe).toHaveProperty("category", expect.any(String));
        expect(recipe).toHaveProperty("instructions", expect.any(String));
        expect(Array.isArray(recipe.ingredients)).toBe(true);
      });
    });
    describe("Get/api/recipes/:category Error handling test ", () => {
      test("should return status 404 when given category doesn't exists ", () => {
        return request(app).get("/api/recipes/invalid").expect(404);
      });
    });
  });

  describe("GET /api/recipe/random", () => {
    test("should respond with a status of 200", async () => {
      await request(app).get("/api/recipe/random").expect(200);
    });
    test("should respond with a random recipe object ", async () => {
      const randomRecipe = await request(app)
        .get("/api/recipe/random")
        .expect(200);
      randomRecipe.body.forEach((randomRecipe) => {
        expect(randomRecipe).toHaveProperty("id", expect.any(Number));
        expect(randomRecipe).toHaveProperty("title", expect.any(String));
        expect(randomRecipe).toHaveProperty("category", expect.any(String));
        expect(randomRecipe).toHaveProperty("instructions", expect.any(String));
        expect(Array.isArray(randomRecipe.ingredients)).toBe(true);
      });
    });
  });

  describe("POST /api/recipe", () => {
    test("respond with 201 when a valid recipe is posted ", async () => {
      const recipeData = {
        title: "test Recipe",
        category: "chicken",
        instructions: "test instructions",
        image: "example.jpg",
        youtube: "https://www.youtube.com/test",
        ingredients: [
          { ingredient: "Ingredient 1", measurement: "Measurement 1" },
          { ingredient: "Ingredient 2", measurement: "Measurement 2" },
        ],
      };
      await request(app).post("/api/recipe").send(recipeData).expect(201);
    });
    test("respond with the recipe added successfully  ", async () => {
      const recipeData = {
        title: "test Recipe",
        category: "chicken",
        instructions: "test instructions",
        image: "example.jpg",
        youtube: "https://www.youtube.com/test",
        ingredients: [
          { ingredient: "Ingredient 1", measurement: "Measurement 1" },
          { ingredient: "Ingredient 2", measurement: "Measurement 2" },
        ],
      };
      const addedRecipe = await request(app)
        .post("/api/recipe")
        .send(recipeData)
        .expect(201);

      addedRecipe.body.forEach((recipe) => {
        expect(recipe).toHaveProperty("id", expect.any(Number));
        expect(recipe).toHaveProperty("title", expect.any(String));
        expect(recipe).toHaveProperty("category", expect.any(String));
        expect(recipe).toHaveProperty("instructions", expect.any(String));
        expect(recipe).toHaveProperty("image", expect.any(String));
        expect(recipe).toHaveProperty("youtube", expect.any(String));
        expect(Array.isArray(recipe.ingredients)).toBe(true);
      });
    });

    describe("POST /api/recipe Error handling", () => {
      test("respond with status 400 when one or more property field are incorrect  ", async () => {
        const wrongRecipeData = {
          wrong: "test Recipe",
          category: "chicken",
          wrong2: "test instructions",
          image: "example.jpg",
          youtube: "https://www.youtube.com/test",
          ingredients: [
            { ingredient: "Ingredient 1", measurement: "Measurement 1" },
            { ingredient: "Ingredient 2", measurement: "Measurement 2" },
          ],
        };
        await request(app)
          .post("/api/recipe")
          .send(wrongRecipeData)
          .expect(400);
      });
    });
  });
});
