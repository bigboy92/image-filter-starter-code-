import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  app.get("/filteredImage", (request:string, response:string) => {
    const { image_url } = request.query;
    // check if u-rl is provided
    if (!image_url) {
      response.status(400).send({message: ' You should provide image_url'});
    }
    
    const urlExists = require('url-exists-deep');
    urlExists(image_url).then((exists: Boolean) => {
      // check if provided url is valid
      if (!exists) {
        return response.status(400).send('Url validation failed');
      } else {
        // filter the image from the provided url
        filterImageFromURL(image_url)
        .then( 
          filtered_image => {
            // send file in the respons, then delete
            response.sendFile(filtered_image, () =>
              deleteLocalFiles([filtered_image])
            );
          },
          error => response.sendStatus(422).send("Something bad happened: Unable to process input image.")
        ).catch (err => {
          //console.error(err);
          response.sendStatus(422).send("Something bad happened: Unable to process input image.");
        });
      }
    });
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();