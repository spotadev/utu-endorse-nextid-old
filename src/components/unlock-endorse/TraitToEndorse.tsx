import appStyle from '../../../App.module.css'

export default function TraitToEndorse(props: any) {

  const setTraitFunction = props.setTraitFunction;
  const trait = '';

  return (
    <>
      <select id="selectTrait"
        value={trait}
        onChange={(event) => { setTraitFunction(event.target.value) }}
        className={appStyle.input}
      >
        <option value="">Select...</option>
        <option value="is_real_genuine_person">Is real genuine person</option>
        <option value="is_not_corrupt">Is not corrupt</option>
        <option value="i_trust_them">I trust them</option>
      </select>
    </>
  );
}