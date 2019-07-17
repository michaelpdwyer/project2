// var config = {
//   type: Phaser.AUTO,
//   parent: "gameHere",
//   width: 800,
//   height: 600,
//   physics: {
//     default: "arcade",
//     arcade: {
//       gravity: { y: 300 },
//       debug: false
//     }
//   },
//   scene: {
//     preload: preload,
//     create: create,
//     update: update
//   }
// };



import 'phaser';
 
export default {
  ttype: Phaser.AUTO,
  parent: "gameHere",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};
