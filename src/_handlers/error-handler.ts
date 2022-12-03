export class ErrorHandler{

  static DefaultException(error:any, res?){
    try{
      res.status(500).send({ error, ...(error.code && {code: error.code}) });
    }
    catch(ex){
      console.error(error);
    }
  }
  static AuthorizationException(error:any, res?){
    try{
      res.status(400).send({ error, ...(error.code && {code: error.code}) });
    }
    catch(ex){
      console.error(error);
    }
  }
  static ConflictException(error:any, res?){
    try{
      res.status(409).send({ error, ...(error.code && {code: error.code}) });
    }
    catch(ex){
      console.error(error);
    }
  }
  //
}
