
import { rest } from "msw";
import { data } from "./data";

let questions = data;

export const handlers = [
  // GET all questions
  rest.get("http://localhost:4000/questions", (req, res, ctx) => {
    return res(ctx.json(questions));
  }),

  // POST a new question
  rest.post("http://localhost:4000/questions", async (req, res, ctx) => {
    const id = questions[questions.length - 1]?.id + 1 || 1;
    const body = await req.json();
    const question = { id, ...body };
    questions.push(question);
    return res(ctx.status(201), ctx.json(question));
  }),

  // DELETE a question
  rest.delete("http://localhost:4000/questions/:id", (req, res, ctx) => {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res(ctx.status(400), ctx.json({ message: "Invalid ID" }));
    }

    questions = questions.filter((q) => q.id !== parsedId);
    return res(ctx.status(204));
  }),

  // PATCH a question's correctIndex
  rest.patch("http://localhost:4000/questions/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const body = await req.json();
    const { correctIndex } = body;

    const question = questions.find((q) => q.id === parsedId);

    if (!question) {
      return res(ctx.status(404), ctx.json({ message: "Question not found" }));
    }

    question.correctIndex = correctIndex;
    return res(ctx.json(question));
  }),
];
