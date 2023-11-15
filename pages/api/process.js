// Schema for req.body
// exposure_duration
// met_activity_name
// met_activity_value
// relative_humidity
// air_speed
// air_temperature
// radiant_temperature
// clo_ensemble_name

import axios from "axios";
import clothing from "../../reference/local clo input/clothing_ensembles.json";

const stand_fr = {
  Head: 1.0,
  Chest: 0.82,
  Back: 0.82,
  Pelvis: 0.65,
  "Left Upper Arm": 0.82,
  "Right Upper Arm": 0.82,
  "Left Lower Arm": 0.65,
  "Right Lower Arm": 0.65,
  "Left Hand": 0.47,
  "Right Hand": 0.47,
  "Left Thigh": 0.47,
  "Right Thigh": 0.47,
  "Left Lower Leg": 0.24,
  "Right Lower Leg": 0.24,
  "Left Foot": 0.0,
  "Right Foot": 0.0,
};
const sit_fr = {
  Head: 1.0,
  Chest: 0.77,
  Back: 0.77,
  Pelvis: 0.65,
  "Left Upper Arm": 0.77,
  "Right Upper Arm": 0.77,
  "Left Lower Arm": 0.65,
  "Right Lower Arm": 0.65,
  "Left Hand": 0.54,
  "Right Hand": 0.54,
  "Left Thigh": 0.54,
  "Right Thigh": 0.54,
  "Left Lower Leg": 0.23,
  "Right Lower Leg": 0.23,
  "Left Foot": 0.0,
  "Right Foot": 0.0,
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      let phases = [],
        currTimer = 0;
      for (let i = 0; i < req.body.phases.length; i++) {
        phases.push({
          start_time: currTimer,
          time_units: "minutes",
          ramp: false,
          end_time: currTimer + req.body.phases[i].exposure_duration,
          met_activity_name: req.body.phases[i].met_activity_name,
          met: req.body.phases[i].met_activity_value,
          default_data: {
            rh:
              req.body.phases[i].relative_humidity.reduce((a, b) => a + b) /
              (req.body.phases[i].relative_humidity.length * 100),
            v:
              req.body.phases[i].air_speed.reduce((a, b) => a + b) /
              req.body.phases[i].air_speed.length,
            solar: 0,
            ta:
              req.body.phases[i].air_temperature.reduce((a, b) => a + b) /
              req.body.phases[i].air_temperature.length,
            mrt:
              req.body.phases[i].radiant_temperature.reduce((a, b) => a + b) /
              req.body.phases[i].radiant_temperature.length,
          },
          clo_ensemble_name: req.body.phases[i].clo_ensemble_name,
          segment_data: {
            Head: {
              mrt: req.body.phases[i].radiant_temperature[0],
              rh: req.body.phases[i].relative_humidity[0],
              solar: 0,
              ta: req.body.phases[i].air_temperature[0],
              v: req.body.phases[i].air_speed[0],
            },
            Chest: {
              mrt: req.body.phases[i].radiant_temperature[1],
              rh: req.body.phases[i].relative_humidity[1],
              solar: 0,
              ta: req.body.phases[i].air_temperature[1],
              v: req.body.phases[i].air_speed[1],
            },
            Back: {
              mrt: req.body.phases[i].radiant_temperature[2],
              rh: req.body.phases[i].relative_humidity[2],
              solar: 0,
              ta: req.body.phases[i].air_temperature[2],
              v: req.body.phases[i].air_speed[2],
            },
            Pelvis: {
              mrt: req.body.phases[i].radiant_temperature[3],
              rh: req.body.phases[i].relative_humidity[3],
              solar: 0,
              ta: req.body.phases[i].air_temperature[3],
              v: req.body.phases[i].air_speed[3],
            },
            "Left Upper Arm": {
              mrt: req.body.phases[i].radiant_temperature[4],
              rh: req.body.phases[i].relative_humidity[4],
              solar: 0,
              ta: req.body.phases[i].air_temperature[4],
              v: req.body.phases[i].air_speed[4],
            },
            "Right Upper Arm": {
              mrt: req.body.phases[i].radiant_temperature[5],
              rh: req.body.phases[i].relative_humidity[5],
              solar: 0,
              ta: req.body.phases[i].air_temperature[5],
              v: req.body.phases[i].air_speed[5],
            },
            "Left Lower Arm": {
              mrt: req.body.phases[i].radiant_temperature[6],
              rh: req.body.phases[i].relative_humidity[6],
              solar: 0,
              ta: req.body.phases[i].air_temperature[6],
              v: req.body.phases[i].air_speed[6],
            },
            "Right Lower Arm": {
              mrt: req.body.phases[i].radiant_temperature[7],
              rh: req.body.phases[i].relative_humidity[7],
              solar: 0,
              ta: req.body.phases[i].air_temperature[7],
              v: req.body.phases[i].air_speed[7],
            },
            "Left Hand": {
              mrt: req.body.phases[i].radiant_temperature[8],
              rh: req.body.phases[i].relative_humidity[8],
              solar: 0,
              ta: req.body.phases[i].air_temperature[8],
              v: req.body.phases[i].air_speed[8],
            },
            "Right Hand": {
              mrt: req.body.phases[i].radiant_temperature[9],
              rh: req.body.phases[i].relative_humidity[9],
              solar: 0,
              ta: req.body.phases[i].air_temperature[9],
              v: req.body.phases[i].air_speed[9],
            },
            "Left Thigh": {
              mrt: req.body.phases[i].radiant_temperature[10],
              rh: req.body.phases[i].relative_humidity[10],
              solar: 0,
              ta: req.body.phases[i].air_temperature[10],
              v: req.body.phases[i].air_speed[10],
            },
            "Right Thigh": {
              mrt: req.body.phases[i].radiant_temperature[11],
              rh: req.body.phases[i].relative_humidity[11],
              solar: 0,
              ta: req.body.phases[i].air_temperature[11],
              v: req.body.phases[i].air_speed[11],
            },
            "Left Lower Leg": {
              mrt: req.body.phases[i].radiant_temperature[12],
              rh: req.body.phases[i].relative_humidity[12],
              solar: 0,
              ta: req.body.phases[i].air_temperature[12],
              v: req.body.phases[i].air_speed[12],
            },
            "Right Lower Leg": {
              mrt: req.body.phases[i].radiant_temperature[13],
              rh: req.body.phases[i].relative_humidity[13],
              solar: 0,
              ta: req.body.phases[i].air_temperature[13],
              v: req.body.phases[i].air_speed[13],
            },
            "Left Foot": {
              mrt: req.body.phases[i].radiant_temperature[14],
              rh: req.body.phases[i].relative_humidity[14],
              solar: 0,
              ta: req.body.phases[i].air_temperature[14],
              v: req.body.phases[i].air_speed[14],
            },
            "Right Foot": {
              mrt: req.body.phases[i].radiant_temperature[15],
              rh: req.body.phases[i].relative_humidity[15],
              solar: 0,
              ta: req.body.phases[i].air_temperature[15],
              v: req.body.phases[i].air_speed[15],
            },
          },
        });

        currTimer += req.body.phases[i].exposure_duration;
      }
      const obj = {
        name: "CBE Interface Test",
        description: "Prototype testing requests",
        reference_time: new Date(),
        output_freq: 60,
        options: {
          csvOutput: false,
          sensation_adaptation: false,
          sensation_coredTdt: false,
          ignore_segments: false,
          ignore_physiology: false,
          neutralSimulationOutput: false,
        },
        phases: phases,
        clothing: clothing,
      };
      const interfaceResult = await axios
        .post(process.env.DB_URL, {
          ...obj,
        })
        .then((result) => {
          let graphObject = [],
            ctr = 0;
          for (let i = 0; i < req.body.phases.length; i++) {
            for (let j = 0; j < req.body.phases[i].exposure_duration; j++) {
              let innerGraph = [];
              innerGraph.push(result.data.results[ctr].overall);
              for (const key in result.data.results[ctr].segments) {
                if (result.data.results[ctr].segments.hasOwnProperty(key)) {
                  innerGraph.push(result.data.results[ctr].segments[key]);
                }
              }
              innerGraph[0]["met"] = result.data.results[ctr].met;
              innerGraph[0]["clo"] = result.data.results[ctr].clo;
              graphObject.push(innerGraph);
              ctr += 1;
            }
          }
          return res.json(graphObject);
        });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, error: err.response });
    }
  }
}
