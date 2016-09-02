




var key_128 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

/*
  Encryption
  This fucntion basically used to encrypt the data like username , password etc...
   */

/**

   * @memberof EncryptionDecryption

   * @function Encrypt

   * @desc This fucntion basically used to encrypt the data like username , password etc..

   */
function Encrypt(InputString) 
{
    //Passing the key value , The reason why we are taking key value as 16 because it provides 128 which is needed to the encryption
    var key=16;
    //Passing the input data to the text variable
    var text = InputString;
    // Converting the text into bytes using the function defined in aes.js 
    var textBytes = aesjs.util.convertStringToBytes(text);
    //Assigning the  counter 
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    //Calling the Encrypt in aes.js
    var encryptedBytes = aesCtr.encrypt(textBytes);

   var EncryptedText = aesjs.util.convertBytesToString(encryptedBytes);

   //Returning the EncryptedBytes
    return EncryptedText;    

}
/*
  Decryption
  This fucntion basically used to Decrypt the data to original like username , password etc... 
   */


/**

   * @memberof EncryptionDecryption

   * @function Decrypt

   * @desc This fucntion basically used to Decrypt the data to original like username , password etc... 

   */

//function Decrypt(encryptedBytes) 
function Decrypt(EncryptedString) 
{
    //Passing the key value
    var key=16;
    //Assigning the  counter 
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

    //Passing the input Encrypted bytes to the Decrypt
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    //Converting the decryptedBytes to String
    var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);

    //Returning the Decrypted Text
    return decryptedText;   

}

   
    
    