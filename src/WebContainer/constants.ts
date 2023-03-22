export namespace WebContainerNP {
  export enum ActionTypeEnum {
    Create_File = 'Create_File',
    Create_Dir = 'Create_Dir',

    Del = 'Del',

    Rename = 'Rename',
  }

  export enum TargetTypeEnum {
    File,

    Dir,

    None,
  }

  export const menuOptionsMap = {
    [TargetTypeEnum.File]: [
      {
        value: ActionTypeEnum.Del,
        text: '删除文件',
      },

      {
        value: ActionTypeEnum.Rename,
        text: '重命名',
      },
    ],

    [TargetTypeEnum.Dir]: [
      {
        value: ActionTypeEnum.Del,
        text: '删除文件夹',
      },

      // {
      //   value: ActionTypeEnum.Rename,
      //   text: "重命名",
      // },

      {
        value: ActionTypeEnum.Create_File,
        text: '新建文件',
      },

      {
        value: ActionTypeEnum.Create_Dir,
        text: '新建文件夹',
      },
    ],

    [TargetTypeEnum.None]: [
      {
        value: ActionTypeEnum.Create_File,
        text: '新建文件',
      },

      {
        value: ActionTypeEnum.Create_Dir,
        text: '新建文件夹',
      },
    ],
  };
}
