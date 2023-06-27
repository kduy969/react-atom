// import { Pipe } from "./pipe";
// import { Observable, Subject } from "rxjs";
//
// export class PipeRxjs<I, O = I> extends Pipe<I, O> {
//   subject = new Subject<I>();
//
//   constructor(
//     createObservable: (originalSubject: Subject<I>) => Observable<O>
//   ) {
//     super();
//     const observable = createObservable(this.subject);
//     observable.subscribe({
//       next: (value) => {
//         this.output(value);
//       },
//     });
//   }
//
//   override input(i: I) {
//     this.subject.next(i);
//   }
// }
