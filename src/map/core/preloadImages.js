import { grey } from '@mui/material/colors';
import createPalette from '@mui/material/styles/createPalette';
import { loadImage, prepareIcon } from './mapUtil';

import directionSvg from '../../resources/images/direction.svg';
import backgroundSvg from '../../resources/images/background.svg';
import animalSvg from '../../resources/images/icon/animal.svg';
import bicycleSvg from '../../resources/images/icon/bicycle.svg';
import boatSvg from '../../resources/images/icon/boat.svg';
import busSvg from '../../resources/images/icon/bus.svg';
import carSvg from '../../resources/images/icon/car.svg';
import camperSvg from '../../resources/images/icon/camper.svg';
import craneSvg from '../../resources/images/icon/crane.svg';
import defaultSvg from '../../resources/images/icon/default.svg';
import startSvg from '../../resources/images/icon/start.svg';
import finishSvg from '../../resources/images/icon/finish.svg';
import helicopterSvg from '../../resources/images/icon/helicopter.svg';
import eautoSvg from '../../resources/images/icon/eauto.svg';
import motorcycleSvg from '../../resources/images/icon/motorcycle.svg';
import personSvg from '../../resources/images/icon/person.svg';
import planeSvg from '../../resources/images/icon/plane.svg';
import scooterSvg from '../../resources/images/icon/scooter.svg';
import shipSvg from '../../resources/images/icon/ship.svg';
import tractorSvg from '../../resources/images/icon/tractor.svg';
import trailerSvg from '../../resources/images/icon/trailer.svg';
import trainSvg from '../../resources/images/icon/train.svg';
import tramSvg from '../../resources/images/icon/tram.svg';
import truckSvg from '../../resources/images/icon/truck.svg';
import vanSvg from '../../resources/images/icon/van.svg';
import hyvaSvg from '../../resources/images/icon/hyva.svg';
import jcbSvg from '../../resources/images/icon/jcb.svg';
import pickupSvg from '../../resources/images/icon/pickup.svg';
import erickshawSvg from '../../resources/images/icon/re.svg';
import schoolbusSvg from '../../resources/images/icon/schoolbus.svg';
import schoolvanSvg from '../../resources/images/icon/schoolvan.svg';
import suvSvg from '../../resources/images/icon/suv.svg';
import taxiSvg from '../../resources/images/icon/taxi.svg';
import royalenfieldSvg from '../../resources/images/icon/royalenfield.svg';
import royalenfieldtwoSvg from '../../resources/images/icon/royalenfieldtwo.svg';











export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  camper: camperSvg,
  crane: craneSvg,
  default: defaultSvg,
  finish: finishSvg,
  helicopter: helicopterSvg,
  eauto:eautoSvg,
  motorcycle: motorcycleSvg,
  person: personSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  start: startSvg,
  tractor: tractorSvg,
  trailer: trailerSvg,
  train: trainSvg,
  tram: tramSvg,
  truck: truckSvg,
  van: vanSvg,
  hyva:hyvaSvg,
  jcb:jcbSvg,
  pickup:pickupSvg,
  erickshaw:erickshawSvg,
  schoolbus:schoolbusSvg,
  schoolvan:schoolvanSvg,
  suv:suvSvg,
  taxi:taxiSvg,
  royalenfield:royalenfieldSvg,
  royalenfieldtwo:royalenfieldtwoSvg
  
};

export const mapIconKey = (category) => {
  
  console.log(" Category "+category);
  
  switch (category) {
    case 'offroad':
    case 'pickup':
      return 'pickup';
    case 'trolleybus':
      return 'bus';
     default:
      return mapIcons.hasOwnProperty(category) ? category : 'default';
  }
};

export const mapImages = {};

const mapPalette = createPalette({
  neutral: { main: grey[500] },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));
  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];
    ['info', 'success', 'error', 'neutral'].forEach((color) => {
      results.push(loadImage(mapIcons[category]).then((icon) => {
        mapImages[`${category}-${color}`] = prepareIcon(background, icon, mapPalette[color].main);
      }));
    });
    await Promise.all(results);
  }));
};
