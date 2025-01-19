-- SQLite
DROP TABLE IF EXISTS library;

-- Create the 'library' table
CREATE TABLE library(
   id        INTEGER  NOT NULL PRIMARY KEY  
  ,bookTitle VARCHAR(50) NOT NULL
  ,bookGenre  VARCHAR(20) NOT NULL
  , publishedYear INTEGER NOT NULL CHECK (publishedYear > 0), 
   rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)   
);


select * from library;
