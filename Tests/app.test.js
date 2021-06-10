const request = require("supertest");
const crypto = require("crypto")
const mongoose = require('mongoose');
const x = require("../app");

describe("GET / ", () => {
  test("It should respond with Login Page", async () => {
    const response = await request(x.app).get("/loginpage");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with admin", async () => {
    const response = await request(x.app).get("/page1");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with faculty_course_page", async () => {
    const response = await request(x.app).get("/page2");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with faculty_portal_page", async () => {
    const response = await request(x.app).get("/page3");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with forgot password", async () => {
    const response = await request(x.app).get("/page4");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET / ", () => {
  test("It should respond with Google Login Page", async () => {
    const response = await request(x.app).get("/googlelogin");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with OTP Generation Page", async () => {
    const response = await request(x.app).get("/otpgen");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with Password Reset Section", async () => {
    const response = await request(x.app).get("/passreset");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with Edited Profile Section", async () => {
    const response = await request(x.app).get("/alterpro");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with Question Paper Section", async () => {
    const response = await request(x.app).get("/qpaper");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with Username on Portal Page", async () => {
    const response = await request(x.app).get("/facultyback");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with List of Courses of the Faculty", async () => {
    const response = await request(x.app).get("/showcourses");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with List of Courses offered by the University", async () => {
    const response = await request(x.app).get("/displaycourses");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with rendering of Student Portal Page", async () => {
    const response = await request(x.app).get("/studentback");
    expect(response.statusCode).toBe(200);
  });
});
describe("GET / ", () => {
  test("It should respond with rendering of Faculty Portal Page", async () => {
    const response = await request(x.app).get("/facultyback");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET / ", () => {
  test("It should respond with Displaying Files of a Course", async () => {
    const response = await request(x.app).get("/displayfiles");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET / ", () => {
  test("It should respond with faculty's feedbacks", async () => {
    const response = await request(x.app).get("/feedbacks");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET / ", () => {
  test("It should respond with Username on Portal Page", async () => {
    const response = await request(x.app).get("/facultyback");
    expect(response.statusCode).toBe(200);
  });
});

describe("GET / ", () => {
  test("It should respond with logging out of the user dashboard and redirects to Login Page", async () => {
    const response = await request(x.app).get("/logout");
    expect(response.statusCode).toBe(302);
  });
});
describe("GET / ", () => {
  test("Redirecting to the user dashboard is not allowed before login", async () => {
    const response = await request(x.app).get("/editprofile");
    expect(response.statusCode).toBe(404);
  });
});

describe('POST /f1submit', () => {
  jest.setTimeout(30000);
  test('It sends a mail to user for a forgot password request', async () => {
    function setTimeoutPromise(delay) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), delay);
      });
    }
    const response = await request(x.app)
      .post('/f1submit')
      .query({
        username: "F.001",
        email: `ashwithjason@gmail.com`,
      });
    expect(response.statusCode).toBe(200);
    await setTimeoutPromise(0);
  });
});

describe('POST /f2submit', () => {
  jest.setTimeout(30000);
  test('Checks if mail OPT is equal to entered OTP for a password request change', async () => {
    const response = await request(x.app)
      .post('/f2submit')
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /dashboard', () => {
  jest.setTimeout(30000);
  test('It renders the login page if the user trying to login is not registered', async () => {
    const response = await request(x.app)
      .get('/dashboard')
      .query({
        email: "ashwithjason@gmail.com",
      });
    expect(response.statusCode).toBe(302);
  });
});


afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 10000)); // avoid jest open handle error
});

afterAll(() => mongoose.disconnect());