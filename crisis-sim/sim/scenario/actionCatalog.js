/* Faithful port of OperatingRoom.Simulation.ActionCatalog.
   Engine/UI action names ↔ snake_case canonical keys. Lookups are
   case-insensitive on the key (StringComparer.OrdinalIgnoreCase). */

const RAW = {
  // oxygenation / airway
  PreOxygenate: 'preoxygenate', SetFiO2_100: 'increase_fio2', FiO2_100: 'increase_fio2',
  IncreaseFiO2: 'increase_fio2', GiveOxygen: 'increase_fio2', SupplementalO2: 'increase_fio2',
  Intubate: 'intubate', PlaceETT: 'intubate',
  ConfirmEtCO2: 'confirm_etco2', CheckEtCO2: 'confirm_etco2',
  MaskVentilate: 'mask_ventilate', BagMask: 'mask_ventilate',
  CPAP: 'cpap', JawThrust: 'airway_maneuver', AirwayManeuver: 'airway_maneuver',
  PlaceLMA: 'place_lma', CallForHelp: 'call_for_help', CallHelp: 'call_for_help',
  // ventilation
  Hyperventilate: 'increase_ventilation', IncreaseVentilation: 'increase_ventilation',
  IncreaseMV: 'increase_ventilation', ChangeVentMode: 'change_vent_mode',
  AdjustPEEP: 'adjust_peep',
  // agents / volatile
  StopVolatile: 'stop_volatile', StopSevoflurane: 'stop_volatile', TurnOffAgent: 'stop_volatile',
  IncreaseSevoflurane: 'deepen_anesthesia', IncreaseAgent: 'deepen_anesthesia', DeependAnesthesia: 'deepen_anesthesia',
  // circulation
  GiveFluidBolus: 'fluid_bolus', FluidBolus: 'fluid_bolus', GiveFluids: 'fluid_bolus',
  GiveBlood: 'give_blood', Transfuse: 'give_blood', SourceControl: 'source_control',
  ActiveCooling: 'cool_patient', IcePacks: 'cool_patient', CoolPatient: 'cool_patient',
  StopAntibiotic: 'stop_trigger_agent', StopInfusion: 'stop_trigger_agent',
  GiveLipid: 'administer_lipid', Intralipid: 'administer_lipid',
  // drugs
  GivePropofol: 'propofol_administered', Propofol: 'propofol_administered', AdministerPropofol: 'propofol_administered',
  GiveFentanyl: 'fentanyl_administered', Fentanyl: 'fentanyl_administered',
  GiveRocuronium: 'rocuronium_administered', Rocuronium: 'rocuronium_administered',
  GiveSuccinylcholine: 'succinylcholine_administered', Succinylcholine: 'succinylcholine_administered',
  GiveMidazolam: 'midazolam_administered', Midazolam: 'midazolam_administered',
  GivePhenylephrine: 'phenylephrine_administered', Phenylephrine: 'phenylephrine_administered',
  GiveEphedrine: 'ephedrine_administered', Ephedrine: 'ephedrine_administered',
  GiveEpinephrine: 'epinephrine_administered', Epinephrine: 'epinephrine_administered',
  GiveAtropine: 'atropine_administered', Atropine: 'atropine_administered',
  GiveGlycopyrrolate: 'glycopyrrolate_administered', Glycopyrrolate: 'glycopyrrolate_administered',
  GiveDantrolene: 'dantrolene_administered', Dantrolene: 'dantrolene_administered',
  GiveNaloxone: 'naloxone_administered', Naloxone: 'naloxone_administered',
  GiveAlbuterol: 'albuterol_administered', Albuterol: 'albuterol_administered',
  GiveEtomidate: 'etomidate_administered', Etomidate: 'etomidate_administered',
  GiveKetamine: 'ketamine_administered', Ketamine: 'ketamine_administered',
};

// case-insensitive lookup map
const MAP = new Map();
for (const [k, v] of Object.entries(RAW)) MAP.set(k.toLowerCase(), v);

export const ActionCatalog = {
  canonical(engineAction) {
    if (!engineAction) return '';
    const hit = MAP.get(engineAction.toLowerCase());
    if (hit !== undefined) return hit;
    return engineAction.trim().toLowerCase().replace(/ /g, '_');
  },
  drugKey(drugName) {
    return !drugName ? '' : `${drugName.trim().toLowerCase()}_administered`;
  },
  isDrugKey(canonical) {
    const suffix = '_administered';
    if (canonical && canonical.endsWith(suffix)) {
      return { ok: true, drug: canonical.substring(0, canonical.length - suffix.length) };
    }
    return { ok: false, drug: null };
  },
};
