import { IdsItem } from "../../../services/next-id/nextIdCheckAvatarService";
import GuiIdsItem from "./GuiIdsItem";

export default function SelectNextIdDID(props: any) {

  const idsItems: IdsItem[] = props.idsItems;

  if (idsItems && idsItems.length > 0) {
    return (
      <>
        {idsItems.map((idsItem, index) => (
          <GuiIdsItem idsItem={idsItem} key={index} />
        ))
        }
      </>
    );
  }
  else {
    return (
      'No results yet'
    );
  }
}