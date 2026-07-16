const response = await fetch("http://localhost:4321/api/test", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hello: "world",
  }),
});

console.log(await response.text());
