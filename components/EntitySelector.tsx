import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  MutableRefObject,
} from "react";
import buildUrlWithQuery from "@/libs/buildUrl";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Loading from "./Loading";

export type EntityObj = {
  id: string;
  name: string;
  category: string;
};

type BelongHisteryObj = {
  entityId: string;
  entityOrganizationId: string;
  joinDate: Date;
  leaveDate: Date;
};

type EntitySelectorProps = {
  setEntityId: Dispatch<SetStateAction<Array<EntityObj>>>;
  entityIdString: MutableRefObject<string[]>;
};

export default function EntitySelector({
  setEntityId,
  entityIdString,
}: EntitySelectorProps) {
  // API[Entity]で取得したデータを格納
  const [apiDataEntity, setApiDataEntity] = useState<Array<EntityObj>>([]);
  // apiDataEntityからidを指定してobjを抜き出す。
  const getApiDataEntityFromId = (id: string): EntityObj | undefined => {
    return apiDataEntity.find((item: EntityObj) => {
      // IDが一致する場合、そのitemを返す
      if (item["id"] === id) {
        return item;
      }
    });
  };
  // API[Entity]通信中かどうか
  const [loadingEntity, setLoadingEntity] = useState(true);
  // API[Entity]通信でエラーが出たかどうか
  const [errorEntity, setErrorEntity] = useState<string | null>(null);

  // API[BelongHistery]で取得したデータを格納
  const [apiDataBelongHistery, setApiDataBelongHistery] = useState<
    Array<BelongHisteryObj>
  >([]);
  // Entity Organisation Idと Entity Person IDで、そのパーソンが組織に所属しているかどうかを返す
  const isPersonInOrganization = (
    entityPersonId: string,
    entityOrganizationId: string
  ): BelongHisteryObj | undefined => {
    return apiDataBelongHistery.find((item: BelongHisteryObj) => {
      // 条件に一致するアイテムがある場合 true を返す
      return (
        item["entityId"] === entityPersonId &&
        item["entityOrganizationId"] === entityOrganizationId
      );
    });
  };

  // API[BelongHistery]通信中かどうか
  const [loadingBelongHistery, setLoadingBelongHistery] = useState(true);
  // API[BelongHistery]通信でエラーが出たかどうか
  const [errorBelongHistery, setErrorBelongHistery] = useState<string | null>(
    null
  );

  // モーダル[組織]を開いてるかどうか
  const [openOrganisation, setOpenOrganisation] = useState(false);
  // モーダル[人物]を開いてるかどうか
  const [openPerson, setOpenPerson] = useState(false);

  // モーダル[組織]を開く時に実行
  const handleClickOpenOrganisation = () => {
    setOpenOrganisation(true);
  };
  // モーダル[人物]を開く時に実行
  const handleClickOpenPerson = () => {
    setOpenPerson(true);
  };

  // モーダル[組織][人物]を閉じる時に実行
  const handleClose = () => {
    setOpenOrganisation(false);
    setOpenPerson(false);
  };

  // 選択されているentityId[人物]
  const [selectEntityIdPerson, setSelectEntityIdPerson] = useState<
    Array<EntityObj>
  >([{ id: "椿佳宵", name: "椿佳宵", category: "person" }]);
  // 選択されているentityId[組織]
  const [selectEntityIdOrganisation, setSelectEntityIdOrganisation] = useState<
    Array<EntityObj>
  >([{ id: "ぷらそにか", name: "ぷらそにか", category: "organization" }]);

  // HTMLでID[人物]を選択されたら実行
  const onClickPerson = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const r = getApiDataEntityFromId(id);
    if (r !== undefined) {
      setSelectEntityIdPerson([r]);
    } else {
      setSelectEntityIdPerson([]);
    }
  };
  // HTMLでID[組織]を選択されたら実行
  const onClickOrganisation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    const r = getApiDataEntityFromId(id);
    if (r !== undefined) {
      setSelectEntityIdOrganisation([r]);
    } else {
      setSelectEntityIdOrganisation([]);
    }
  };

  // selectEntityId[人物][組織]の変更を監視し、変化があったら引数のsetEntityIdに値を渡す。
  useEffect(() => {
    const array = selectEntityIdPerson.concat(selectEntityIdOrganisation);
    setEntityId(array);
  }, [selectEntityIdPerson, selectEntityIdOrganisation]);

  // entityIdStringが変更されたらそれを反映する。
  useEffect(() => {
    if (entityIdString["current"].length !== 0) {
      const id = getApiDataEntityFromId(entityIdString["current"][0]);
      if (id && id.category === "person") {
        setSelectEntityIdPerson([id]);
      } else if (id && id.category === "organization") {
        setSelectEntityIdOrganisation([id]);
      } else {
        throw "EntitySelector内でのエラー1";
      }
    }
  }, [entityIdString["current"]]);

  // API[Person]を叩く
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = buildUrlWithQuery(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/v0.0/entity",
          {}
        );
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setApiDataEntity(data["result"]);
      } catch (err) {
        setErrorEntity((err as Error).message); // 'err' を Error 型として扱う
      } finally {
        setLoadingEntity(false);
      }
    };

    fetchEvents();
  }, []);

  // API[BelongHistery]を叩く
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = buildUrlWithQuery(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/v0.0/belonghistery",
          {}
        );
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        let result: Array<BelongHisteryObj> = [];
        for (const item of data["result"]) {
          // 初期化
          let resultItem: BelongHisteryObj = {
            entityId: item["entityId"],
            entityOrganizationId: item["entityOrganizationId"],
            joinDate: new Date(item["joinDate"]),
            leaveDate: new Date(item["leaveDate"]),
          };
          result.push(resultItem);
        }
        setApiDataBelongHistery(result);
      } catch (err) {
        setErrorBelongHistery((err as Error).message); // 'err' を Error 型として扱う
      } finally {
        setLoadingBelongHistery(false);
      }
    };

    fetchEvents();
  }, []);

  // API通信 ローディング中
  if (loadingEntity && loadingBelongHistery) {
    // return <div>EntitySelector Loding...</div>;
    return <Loading />;
  }
  // API通信 エラーの場合
  if (errorEntity && errorBelongHistery) {
    if (errorEntity) {
      return <div>EntitySelector Entity Error: {errorEntity}</div>;
    } else if (errorBelongHistery) {
      return <div>EntitySelector Histery Error: {errorBelongHistery}</div>;
    } else {
      return <div>EntitySelector unkown Error: {errorEntity}</div>;
    }
  }

  return (
    <div>
      {/* ダイアログを開くボタン */}
      <Button variant="outlined" onClick={handleClickOpenOrganisation}>
        {selectEntityIdOrganisation.length !== 0
          ? selectEntityIdOrganisation[0]["name"]
          : "グループを選択"}
      </Button>
      <Button variant="outlined" onClick={handleClickOpenPerson}>
        {selectEntityIdPerson.length !== 0
          ? selectEntityIdPerson[0]["name"]
          : "アーティストを選択"}
      </Button>

      {/* [組織]ダイアログコンポーネント */}
      <Dialog open={openOrganisation} onClose={handleClose}>
        <DialogTitle>グループを選択</DialogTitle>
        <DialogContent>
          {/* ダイアログのコンテンツ */}
          <select onChange={onClickOrganisation}>
            <option value="null">選択しない</option>
            {apiDataEntity
              ? apiDataEntity.map((item: EntityObj, index: number) => (
                <>
                  {/* 各アイテムを表示 */}
                  {item["category"] === "organization" && (
                    <option
                      key={index}
                      selected={
                        selectEntityIdOrganisation.length > 0
                          ? item["id"] === selectEntityIdOrganisation[0]["id"]
                          : false
                      }
                      value={item["id"]}
                    >
                      {item["name"]}
                    </option>
                  )}
                </>
              ))
              : null}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* [人物]ダイアログコンポーネント */}
      <Dialog open={openPerson} onClose={handleClose}>
        <DialogTitle>アーティストを選択</DialogTitle>
        <DialogContent>
          {/* ダイアログのコンテンツ */}

          <select onChange={onClickPerson}>
            <option value="null">選択しない</option>
            {apiDataEntity &&
              apiDataEntity.map((item: EntityObj, index: number) => (
                <>
                  {/* 各アイテムを表示 */}
                  {/* ↓ 組織が選択されている場合 */}
                  {item["category"] === "person" &&
                    //  ↓ 現在選択されている組織を考慮する。
                    selectEntityIdOrganisation.length > 0 &&
                    isPersonInOrganization(
                      item["id"],
                      selectEntityIdOrganisation[0]["id"]
                    ) && (
                      <option
                        key={index}
                        selected={
                          selectEntityIdPerson.length > 0
                            ? item["id"] === selectEntityIdPerson[0]["id"]
                            : false
                        }
                        value={item["id"]}
                      >
                        {item["name"]}
                      </option>
                    )}
                  {/* ↓ 組織が選択されていない場合 */}
                  {item["category"] === "person" &&
                    selectEntityIdOrganisation.length === 0 && (
                      <option key={index} value={item["id"]}>
                        {item["name"]}
                      </option>
                    )}
                </>
              ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
