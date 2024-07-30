export const uint8_to_hexStr = (uint8) => {
  return Array.from(uint8)
    .map((i) => i.toString(16).padStart(2, "0"))
    .join("");
};

export const hexStr_to_uint8 = (hexString) =>
  new Uint8Array(
    (hexString.match(/[\da-f]{2}/gi) ?? []).map(function (byte) {
      return parseInt(byte, 16);
    })
  );

export const hexStr_to_arrayBuffer = (hexString) =>
  new Uint8Array(
    (hexString.match(/[\da-f]{2}/gi) ?? []).map(function (byte) {
      return parseInt(byte, 16);
    })
  );
