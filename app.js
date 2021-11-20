//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// ---------------   Azure Blob Storage Section ---------------------------- //

 const { BlobServiceClient } = require("@azure/storage-blob");
 const { v1: uuidv1 } = require("uuid");


 async function main() {
  console.log("Azure Blob storage v12 - JavaScript quickstart sample");
  // Quick start code goes here
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

// Create the BlobServiceClient object which will be used to create a container client
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

// // Get a reference to a container
// containerName = "tutorial-container";
// const containerClient = blobServiceClient.getContainerClient(containerName);

// // Create a unique name for the blob
blobName = "quickstart" + uuidv1() + ".png";

// // Get a block blob client
// const blockBlobClient = containerClient.getBlockBlobClient(blobName);

// // Upload data to the blob
// let uploadBlobResponse;

// async function uploadData() {
//   console.log("\nUploading to Azure storage as blob:\n\t", blobName);
//   const data = "Hello, World2!";
//   uploadBlobResponse = await blockBlobClient.upload(data, data.length);
// }

// uploadData()
//   .then(() => {
//     console.log(
//       "Blob was uploaded successfully. requestId: ",
//       uploadBlobResponse.requestId
//     );
//     console.log(blockBlobClient.url);
//   })
//   .catch((ex) => console.log(ex.message));

// ---------------   Azure Blob Storage Section End ---------------------------- //

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", function (req, res) {
  res.render("home", { thisIsFromApp: homeStartingContent, posts: posts });
});

app.get("/contact", function (req, res) {
  res.render("contact", { thisIsContact: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", { thisIsAbout: aboutContent });
});



app.post("/about", uploadStrategy,function (req, res) {
  
  const stream = getStream(req.file.buffer);
  containerName2 = "tutorial-container";
  const containerClient = blobServiceClient.getContainerClient(containerName2);;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  async function uploadData() {
    console.log("\nUploading to Azure storage as blob:\n\t", blobName);
    uploadBlobResponse = await blockBlobClient.uploadStream(stream,
      uploadOptions.bufferSize, uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpeg" } });
  }

  uploadData()
    .then(() => {
      console.log(
        "Blob was uploaded successfully. requestId: ",
        uploadBlobResponse.requestId
      );
      console.log(blockBlobClient.url);
      res.redirect("/about");
    })
    .catch((ex) => console.log(ex.message));
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody,
  };

  posts.push(post);

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
