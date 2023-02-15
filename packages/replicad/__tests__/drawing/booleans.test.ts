import { expect, test } from "vitest";
import {
  drawRoundedRectangle,
  draw,
  drawCircle,
  drawPolysides,
  Drawing,
  Point2D,
} from "../../src/index";

test("fuses two rectangles", () => {
  const d1 = drawRoundedRectangle(80, 80, 30);
  const d2 = drawRoundedRectangle(10, 100);
  expect(d1.fuse(d2).toSVG()).toMatchSVGSnapshot();
});

test("fuses two circles", () => {
  const d1 = drawCircle(80).translate(-10, 0);
  const d2 = drawCircle(60).translate(30, 0);
  expect(d1.fuse(d2).toSVG()).toMatchSVGSnapshot();
});

test("cuts one rectangle from the other", () => {
  const d1 = drawRoundedRectangle(80, 80, 30);
  const d2 = drawRoundedRectangle(10, 100);
  expect(d1.cut(d2).toSVG()).toMatchSVGSnapshot();
});

test("intersects two rectangles", () => {
  const d1 = drawRoundedRectangle(80, 80, 30);
  const d2 = drawRoundedRectangle(10, 100);
  expect(d1.intersect(d2).toSVG()).toMatchSVGSnapshot();
});

test("fuse two rectangles with corners", () => {
  const d1 = drawRoundedRectangle(80, 80, 30).rotate(20);
  const d2 = drawRoundedRectangle(40, 100);
  expect(d1.fuse(d2).toSVG()).toMatchSVGSnapshot();
});

test("cut two rectangles with corners", () => {
  const d1 = drawRoundedRectangle(80, 80, 30).rotate(20);
  const d2 = drawRoundedRectangle(40, 100);
  expect(d1.cut(d2).toSVG()).toMatchSVGSnapshot();
});

test("handles the case when a compound is created from fusion", () => {
  const d1 = draw([0, -50])
    .hLine(-50)
    .vLine(100)
    .hLine(50)
    .vLine(10)
    .hLine(-60)
    .vLine(-120)
    .hLine(60)
    .close();
  const d2 = drawRoundedRectangle(10, 120).translate(5, 0);
  expect(d1.fuse(d2).toSVG()).toMatchSVGSnapshot();
});

test("cut such that a hole becomes the outside", () => {
  const d1 = drawRoundedRectangle(80, 80);
  const d2 = drawCircle(30);
  const d3 = drawRoundedRectangle(40, 10).translate(20, 0);
  expect(d1.cut(d2).cut(d3).toSVG()).toMatchSVGSnapshot();
});

const polarCopies = (shape: Drawing, count: number, radius: number) => {
  const base = shape.translate(0, radius);
  const angle = 360 / count;

  const copies: Drawing[] = [];
  for (let i = 0; i < count; i++) {
    copies.push(base.rotate(i * angle));
  }
  return copies;
};

const fuseAll = (shapes: Drawing[]) => {
  let result = shapes[0];
  shapes.slice(1).forEach((shape) => {
    result = result.fuse(shape);
  });
  return result;
};

test.each([5, 11, 13])(
  "handles a complex example of merging shapes with %d copies",
  (n) => {
    const shape = drawPolysides(6, 6);
    const outlinedShape = shape.offset(0.5).cut(shape.offset(-0.5));
    const copies = polarCopies(outlinedShape, n, 9);

    const fused = fuseAll(copies);

    expect(fused.toSVG()).toMatchSVGSnapshot();
  }
);

const triangles: [Point2D, Point2D, Point2D][] = [
  [
    [0, 0],
    [14.0625, 0],
    [14.999999999999998, -5.087131436281159],
  ],
  [
    [0, 0],
    [14.999999999999998, -5.087131436281159],
    [-15.000000000000004, -5.087131436281141],
  ],
  [
    [0, 0],
    [-15.000000000000004, -5.087131436281141],
    [-9.037735159573977, 6.763116311474526],
  ],
  [
    [0, 0],
    [-9.037735159573977, 6.763116311474526],
    [1.865174681370263e-14, 15.261394308843476],
  ],
  [
    [-9.037735159573977, 6.763116311474526],
    [-15.000000000000004, -5.087131436281141],
    [-9.675180053141624, 7.189474166860152],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-15.000000000000004, -5.087131436281141],
    [-8.000000000000007, 25.435657181405805],
  ],
  [
    [-8.000000000000007, 25.435657181405805],
    [-15.000000000000004, -5.087131436281141],
    [-7.499999999999897, 35.60992005396811],
  ],
  [
    [-8.000000000000007, 25.435657181405805],
    [-7.499999999999897, 35.60992005396811],
    [-7.814835389770436, 27.176719368153215],
  ],
  [
    [-7.814835389770436, 27.176719368153215],
    [-7.499999999999897, 35.60992005396811],
    [-7.287644378911123, 28.79320082185884],
  ],
  [
    [-7.287644378911123, 28.79320082185884],
    [-7.499999999999897, 35.60992005396811],
    [-6.281519359620161, 30.47602793525325],
  ],
  [
    [-6.281519359620161, 30.47602793525325],
    [-7.499999999999897, 35.60992005396811],
    [-5.159435917248953, 31.656137011351642],
  ],
  [
    [-5.159435917248953, 31.656137011351642],
    [-7.499999999999897, 35.60992005396811],
    [-4.0166211429761844, 32.47480273276338],
  ],
  [
    [-4.0166211429761844, 32.47480273276338],
    [-7.499999999999897, 35.60992005396811],
    [-2.878254499509339, 33.03002377846391],
  ],
  [
    [-2.878254499509339, 33.03002377846391],
    [-7.499999999999897, 35.60992005396811],
    [-1.7485555329428917, 33.378267927827935],
  ],
  [
    [-1.7485555329428917, 33.378267927827935],
    [-7.499999999999897, 35.60992005396811],
    [-0.6254051035361321, 33.55015764894129],
  ],
  [
    [-0.6254051035361321, 33.55015764894129],
    [-7.499999999999897, 35.60992005396811],
    [0.49519544040220814, 33.559459272681295],
  ],
  [
    [0.49519544040220814, 33.559459272681295],
    [-7.499999999999897, 35.60992005396811],
    [7.500000000000104, 35.60992005396825],
  ],
  [
    [0.49519544040220814, 33.559459272681295],
    [7.500000000000104, 35.60992005396825],
    [1.6178253438012995, 33.40689452102694],
  ],
  [
    [1.6178253438012995, 33.40689452102694],
    [7.500000000000104, 35.60992005396825],
    [2.746624486362765, 33.08031785939673],
  ],
  [
    [2.746624486362765, 33.08031785939673],
    [7.500000000000104, 35.60992005396825],
    [3.8840547206139435, 32.55139719795343],
  ],
  [
    [3.8840547206139435, 32.55139719795343],
    [7.500000000000104, 35.60992005396825],
    [5.027051998596925, 31.767347767310195],
  ],
  [
    [5.027051998596925, 31.767347767310195],
    [7.500000000000104, 35.60992005396825],
    [6.031511836253476, 30.782797624973057],
  ],
  [
    [6.031511836253476, 30.782797624973057],
    [7.500000000000104, 35.60992005396825],
    [6.748780453713429, 29.806324687291763],
  ],
  [
    [6.748780453713429, 29.806324687291763],
    [7.500000000000104, 35.60992005396825],
    [7.3787323507642855, 28.580526519754564],
  ],
  [
    [7.3787323507642855, 28.580526519754564],
    [7.500000000000104, 35.60992005396825],
    [7.8259843512896605, 27.124084897826446],
  ],
  [
    [7.8259843512896605, 27.124084897826446],
    [7.500000000000104, 35.60992005396825],
    [11.250000000000288, 15.261394308843652],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [1.865174681370263e-14, 15.261394308843476],
    [2.9681946363630565, 17.877212423185448],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [2.9681946363630565, 17.877212423185448],
    [4.137024309826323, 18.469070410223146],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [4.137024309826323, 18.469070410223146],
    [5.230691228137659, 19.27708676467615],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [5.230691228137659, 19.27708676467615],
    [6.218103424245632, 20.31453620788313],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [6.218103424245632, 20.31453620788313],
    [7.0573935209813605, 21.60261968676894],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [7.0573935209813605, 21.60261968676894],
    [7.562614640098201, 22.78119613152436],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [7.562614640098201, 22.78119613152436],
    [7.891565269530931, 24.100075380674866],
  ],
  [
    [2.9681946363630565, 17.877212423185448],
    [1.865174681370263e-14, 15.261394308843476],
    [1.7491031281525513, 17.493171273505435],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [7.891565269530931, 24.100075380674866],
    [7.998836758981678, 25.574454740438988],
  ],
  [
    [1.7491031281525513, 17.493171273505435],
    [1.865174681370263e-14, 15.261394308843476],
    [0.5016277322923197, 17.31226361259904],
  ],
  [
    [0.5016277322923197, 17.31226361259904],
    [1.865174681370263e-14, 15.261394308843476],
    [-0.7537137010686332, 17.332451401390855],
  ],
  [
    [-0.7537137010686332, 17.332451401390855],
    [1.865174681370263e-14, 15.261394308843476],
    [-1.9968522144188805, 17.553880836526915],
  ],
  [
    [-1.9968522144188805, 17.553880836526915],
    [1.865174681370263e-14, 15.261394308843476],
    [-3.2074886001878475, 17.979094300174644],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-8.000000000000007, 25.435657181405805],
    [-7.775336189276026, 23.52026007738302],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-7.775336189276026, 23.52026007738302],
    [-7.202956818990907, 21.89398864152197],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-7.202956818990907, 21.89398864152197],
    [-6.400061873262468, 20.55209494165617],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-6.400061873262468, 20.55209494165617],
    [-5.438236844191913, 19.466079771934012],
  ],
  [
    [-9.675180053141624, 7.189474166860152],
    [-5.438236844191913, 19.466079771934012],
    [-4.363146304020197, 18.6133640552573],
  ],
  [
    [14.999999999999998, -5.087131436281159],
    [14.0625, 0],
    [17.858120437956206, 1.4481615037588669],
  ],
  [
    [14.999999999999998, -5.087131436281159],
    [17.858120437956206, 1.4481615037588669],
    [43.02919708029198, 5.606984283784323],
  ],
  [
    [11.250000000000288, 15.261394308843652],
    [7.500000000000104, 35.60992005396825],
    [12.41788321167908, 15.706982463846387],
  ],
  [
    [17.858120437956206, 1.4481615037588669],
    [12.41788321167908, 15.706982463846387],
    [26.06903892944051, 10.025733487561286],
  ],
  [
    [12.41788321167908, 15.706982463846387],
    [7.500000000000104, 35.60992005396825],
    [18.62074209245758, 28.96323007517763],
  ],
  [
    [18.62074209245758, 28.96323007517763],
    [7.500000000000104, 35.60992005396825],
    [21.514598540146046, 40.956977914001115],
  ],
  [
    [26.06903892944051, 10.025733487561286],
    [12.41788321167908, 15.706982463846387],
    [29.58409367396621, 16.811669764790274],
  ],
  [
    [21.514598540146046, 40.956977914001115],
    [43.02919708029198, 5.606984283784323],
    [26.066377737227047, 29.081589428850528],
  ],
  [
    [-7.499999999999897, 35.60992005396811],
    [-15.000000000000004, -5.087131436281141],
    [-16.15510948905104, 17.13286455985496],
  ],
  [
    [-16.15510948905104, 17.13286455985496],
    [-15.000000000000004, -5.087131436281141],
    [-28.547445255474443, 0.08169116175055202],
  ],
  [
    [-16.15510948905104, 17.13286455985496],
    [-28.547445255474443, 0.08169116175055202],
    [-14.040145985401361, 38.10521372198341],
  ],
  [
    [1.865174681370263e-14, 15.261394308843476],
    [11.250000000000288, 15.261394308843652],
    [3.0730973321624303e-13, 14.011394308843466],
  ],
  [
    [0, 0],
    [1.865174681370263e-14, 15.261394308843476],
    [3.9929182594206813, 0.7486721736413746],
  ],
  [
    [43.02919708029198, 5.606984283784323],
    [21.514598540146046, 40.956977914001115],
    [26.944588276892826, 34.37501582471773],
  ],
  [
    [26.944588276892826, 34.37501582471773],
    [21.514598540146046, 40.956977914001115],
    [26.15196489046622, 36.21535391298498],
  ],
  [
    [26.15196489046622, 36.21535391298498],
    [21.514598540146046, 40.956977914001115],
    [25.84476047405407, 37.916465383064285],
  ],
  [
    [25.84476047405407, 37.916465383064285],
    [21.514598540146046, 40.956977914001115],
    [25.87128579081724, 39.380030657095766],
  ],
  [
    [25.87128579081724, 39.380030657095766],
    [21.514598540146046, 40.956977914001115],
    [26.11100308622886, 40.6355406301655],
  ],
  [
    [26.11100308622886, 40.6355406301655],
    [21.514598540146046, 40.956977914001115],
    [26.497639445753883, 41.724380698725795],
  ],
  [
    [26.497639445753883, 41.724380698725795],
    [21.514598540146046, 40.956977914001115],
    [27.183984543103612, 42.969261082525975],
  ],
  [
    [27.183984543103612, 42.969261082525975],
    [21.514598540146046, 40.956977914001115],
    [28.14843005156051, 44.13722039702907],
  ],
  [
    [43.02919708029198, 5.606984283784323],
    [26.944588276892826, 34.37501582471773],
    [28.19681524206102, 32.73904123800764],
  ],
  [
    [28.14843005156051, 44.13722039702907],
    [21.514598540146046, 40.956977914001115],
    [32.70246150567573, 50.94856048457167],
  ],
  [
    [28.14843005156051, 44.13722039702907],
    [32.70246150567573, 50.94856048457167],
    [29.302767287917, 45.08787343227521],
  ],
  [
    [29.302767287917, 45.08787343227521],
    [32.70246150567573, 50.94856048457167],
    [30.660487593670485, 45.821930600766585],
  ],
  [
    [30.660487593670485, 45.821930600766585],
    [32.70246150567573, 50.94856048457167],
    [32.26313326336891, 46.30353078355222],
  ],
  [
    [32.26313326336891, 46.30353078355222],
    [32.70246150567573, 50.94856048457167],
    [34.18909251852194, 46.42993921740859],
  ],
  [
    [34.18909251852194, 46.42993921740859],
    [32.70246150567573, 50.94856048457167],
    [36.05878789231104, 46.104567924314324],
  ],
  [
    [36.05878789231104, 46.104567924314324],
    [32.70246150567573, 50.94856048457167],
    [37.80932856673241, 45.35236428845875],
  ],
  [
    [37.80932856673241, 45.35236428845875],
    [32.70246150567573, 50.94856048457167],
    [38.896755890916, 44.60503880732156],
  ],
  [
    [38.896755890916, 44.60503880732156],
    [32.70246150567573, 50.94856048457167],
    [65.4049230113465, 25.590149424922807],
  ],
  [
    [38.896755890916, 44.60503880732156],
    [65.4049230113465, 25.590149424922807],
    [39.85252277691971, 43.69306265069026],
  ],
  [
    [39.85252277691971, 43.69306265069026],
    [65.4049230113465, 25.590149424922807],
    [53.255864532494236, 31.199931492767178],
  ],
  [
    [39.85252277691971, 43.69306265069026],
    [53.255864532494236, 31.199931492767178],
    [40.96082719430757, 42.11477162067656],
  ],
  [
    [40.96082719430757, 42.11477162067656],
    [53.255864532494236, 31.199931492767178],
    [41.617184924906304, 40.52050665883264],
  ],
  [
    [41.617184924906304, 40.52050665883264],
    [53.255864532494236, 31.199931492767178],
    [41.9121628340546, 38.984911567240694],
  ],
  [
    [41.9121628340546, 38.984911567240694],
    [53.255864532494236, 31.199931492767178],
    [41.91819260760609, 37.53434128643309],
  ],
  [
    [41.91819260760609, 37.53434128643309],
    [53.255864532494236, 31.199931492767178],
    [41.68434986554822, 36.18220818870151],
  ],
  [
    [41.68434986554822, 36.18220818870151],
    [53.255864532494236, 31.199931492767178],
    [41.2448003312233, 34.93910134437748],
  ],
  [
    [53.255864532494236, 31.199931492767178],
    [65.4049230113465, 25.590149424922807],
    [53.06443267520815, 30.45732160849354],
  ],
  [
    [53.06443267520815, 30.45732160849354],
    [65.4049230113465, 25.590149424922807],
    [52.76874058903504, 29.767968450275603],
  ],
  [
    [52.76874058903504, 29.767968450275603],
    [65.4049230113465, 25.590149424922807],
    [52.380391239898955, 29.13607708911145],
  ],
  [
    [52.380391239898955, 29.13607708911145],
    [65.4049230113465, 25.590149424922807],
    [51.90795647733907, 28.56573184059028],
  ],
  [
    [53.255864532494236, 31.199931492767178],
    [53.06443267520815, 30.45732160849354],
    [51.35824503528044, 28.061326639676654],
  ],
  [
    [41.2448003312233, 34.93910134437748],
    [51.35824503528044, 28.061326639676654],
    [40.624963356048475, 33.81540764943102],
  ],
  [
    [40.624963356048475, 33.81540764943102],
    [51.35824503528044, 28.061326639676654],
    [39.84503080833293, 32.82201797715716],
  ],
  [
    [39.84503080833293, 32.82201797715716],
    [51.35824503528044, 28.061326639676654],
    [38.92211004035242, 31.9708369198837],
  ],
  [
    [51.35824503528044, 28.061326639676654],
    [43.02919708029198, 5.606984283784323],
    [41.70981649381012, 19.444571970323707],
  ],
  [
    [38.92211004035242, 31.9708369198837],
    [41.70981649381012, 19.444571970323707],
    [37.87158172333802, 31.275150413580757],
  ],
  [
    [37.87158172333802, 31.275150413580757],
    [41.70981649381012, 19.444571970323707],
    [36.70686855789293, 30.749684298184345],
  ],
  [
    [41.70981649381012, 19.444571970323707],
    [43.02919708029198, 5.606984283784323],
    [41.10110298369262, 19.022202323429074],
  ],
  [
    [41.10110298369262, 19.022202323429074],
    [43.02919708029198, 5.606984283784323],
    [40.43965903526714, 18.688838444701922],
  ],
  [
    [40.43965903526714, 18.688838444701922],
    [43.02919708029198, 5.606984283784323],
    [39.73056621887958, 18.45214972475783],
  ],
  [
    [39.73056621887958, 18.45214972475783],
    [43.02919708029198, 5.606984283784323],
    [38.979096273465785, 18.32244213836834],
  ],
  [
    [36.70686855789293, 30.749684298184345],
    [38.979096273465785, 18.32244213836834],
    [35.44127054214691, 30.412578797256806],
  ],
  [
    [35.44127054214691, 30.412578797256806],
    [38.979096273465785, 18.32244213836834],
    [34.08776520308343, 30.286619645703045],
  ],
  [
    [34.08776520308343, 30.286619645703045],
    [38.979096273465785, 18.32244213836834],
    [32.660067783034044, 30.402504680495312],
  ],
  [
    [32.660067783034044, 30.402504680495312],
    [38.979096273465785, 18.32244213836834],
    [31.175949749223747, 30.804016529929132],
  ],
  [
    [31.175949749223747, 30.804016529929132],
    [38.979096273465785, 18.32244213836834],
    [29.665104064660564, 31.555294226568517],
  ],
  [
    [65.4049230113465, 25.590149424922807],
    [32.70246150567573, 50.94856048457167],
    [51.465608475382794, 42.9325255674089],
  ],
  [
    [65.4049230113465, 25.590149424922807],
    [51.465608475382794, 42.9325255674089],
    [72.06640589603971, 38.46938254560742],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [51.465608475382794, 42.9325255674089],
    [35.91834979483797, 57.166121301453884],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [35.91834979483797, 57.166121301453884],
    [43.70408043027748, 54.51325500675499],
  ],
  [
    [43.70408043027748, 54.51325500675499],
    [35.91834979483797, 57.166121301453884],
    [42.25506248921485, 55.5666183093269],
  ],
  [
    [42.25506248921485, 55.5666183093269],
    [35.91834979483797, 57.166121301453884],
    [41.07676983910428, 56.916008420237006],
  ],
  [
    [41.07676983910428, 56.916008420237006],
    [35.91834979483797, 57.166121301453884],
    [40.22828699354392, 58.493761284761845],
  ],
  [
    [40.22828699354392, 58.493761284761845],
    [35.91834979483797, 57.166121301453884],
    [39.75216042536598, 60.22076178615197],
  ],
  [
    [39.75216042536598, 60.22076178615197],
    [35.91834979483797, 57.166121301453884],
    [39.67226510883031, 62.010410907941555],
  ],
  [
    [39.67226510883031, 62.010410907941555],
    [35.91834979483797, 57.166121301453884],
    [38.07725906038438, 64.3486773077192],
  ],
  [
    [39.67226510883031, 62.010410907941555],
    [38.07725906038438, 64.3486773077192],
    [39.99260732872179, 63.772968170240155],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [43.70408043027748, 54.51325500675499],
    [45.35116385215525, 53.80873854697423],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [45.35116385215525, 53.80873854697423],
    [47.11372111445385, 53.48839632708271],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [47.11372111445385, 53.48839632708271],
    [48.90337023624344, 53.568291643618366],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [48.90337023624344, 53.568291643618366],
    [50.63037073763354, 54.04441821179629],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [50.63037073763354, 54.04441821179629],
    [52.2081236021584, 54.89290105735665],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [52.2081236021584, 54.89290105735665],
    [53.55751371306851, 56.07119370746722],
  ],
  [
    [72.06640589603971, 38.46938254560742],
    [53.55751371306851, 56.07119370746722],
    [76.38422442713265, 52.834494558138005],
  ],
  [
    [76.38422442713265, 52.834494558138005],
    [53.55751371306851, 56.07119370746722],
    [54.61087701564045, 57.52021164852984],
  ],
  [
    [76.38422442713265, 52.834494558138005],
    [54.61087701564045, 57.52021164852984],
    [55.315393475421125, 59.16729507040763],
  ],
];

test("build from triangles", () => {
  const drawings = triangles
    .sort(() => Math.random() - 0.4)
    .map(([a, b, c]) => draw(a).lineTo(b).lineTo(c).close());

  const fused = fuseAll(drawings);
  expect(fused.toSVG()).toMatchSVGSnapshot();
});