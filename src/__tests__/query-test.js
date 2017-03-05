// import DB from 'schema/db';
// import { CvSchema, Cv } from 'schema/cv';
//
// DB.data.consoleLog = () => {};
//
// afterAll(() => {
//   DB.data.close();
// });

describe.skip('query', () => {
  it('should', () => {
    expect(1).toEqual(1);
    // Cv.findOne().then((r) => {
    //   console.dir(r);
    // });
  });

  // it('Saving a document', (done) => {
  //   expect.assertions(1);
  //   const doc = new Cv({
  //     name: 'Pavel',
  //     lastname: 'Chertorogov',
  //   });
  //   doc.save((err) => {
  //     if (err) throw err;
  //     doc.on('es-indexed', (err, res) => {
  //       if (err) throw err;
  //       console.log(res);
  //       done();
  //     });
  //   });
  // });

  it('Indexing An Existing Collection', () => {
    expect.assertions(1);
    return Cv
      .esSynchronize()
      .then(() => {
        expect(true).toEqual(true);
      });
  });
});
