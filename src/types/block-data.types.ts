type BlockDataType = {
  title: string;
  subtitle: string;
  text: string;
};

type BlockImgDataType = BlockDataType & {
  imgId: string;
};

type BlockBeyondCodeDataType = BlockDataType & {
  tagList: [string];
};

type BlockWhatsNextDataType = BlockDataType & {
  whatsNextList: [WhatsNextElementType];
};

type WhatsNextElementType = {
  title: string;
  imgId: string;
  subtasksList: [string];
};

type BlockCertificatesDataType = BlockDataType & {
  certificatesImgList: [string];
};

// GeneralBlockDataType is a union type that includes all specific block data types
export type GeneralBlockDataType =
  | BlockDataType
  | BlockImgDataType
  | BlockBeyondCodeDataType
  | BlockWhatsNextDataType
  | BlockCertificatesDataType;
