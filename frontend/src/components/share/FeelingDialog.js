import React, { Fragment } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const FeelingDialog = ({ open, onClose }) => {
  return (
    <Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Choose Your Feeling and paste in title</DialogTitle>
        <DialogContent>
          😍🙂😊😀😁😃😄😎😆😂☹️🙁😞😟😣😖😢😭
          😨😧😦😱😫😩😺😸🐱💔❤️🤕❤️‍🩹🐟🐠😏🐠
          🐟🐡🦈🐬🐳🐋🌠☄️💫🌟🍵☕️🦑🐙🐍💣🧨😀 😂 😃 😄 😅 😆 😇 😈 😉 😊 😋😁
          � 🙍 �😌 😍 � 😏 �😐 😑 😒 😓 😔 😕 😖 😗 😘 😙 😚 😛 😜 😝 😞 😟 😠
          😡 😢🙎 🙏🙊 🙋 😤 😥 😦 😧 😨 😩 😪 😫 😬 😭 😮 😯 😰 😱 😲 😳 😴 😵
          😶 😷 😸 😹🙇 🙈 🙉 🙆 😺 😻 😼 😽 😾 😿 🙀 🙁 🙂 🙃 🙄 🙅 🤐 🤑 🤒 🤓
          🤔 🤕 🤖 🤗 🤘 🤙 🤚 🤛 🤜 🤝 🤞 🤟 🤠 🤡 🤢 🤣 🤤 🤥 🤦 🤧 🤨 🤩 🤪
          🤫 🤬 🤭 🤮 🤯 🤰 🤱 🤲 🤳 🤴 🤵 🤶 🤷 🤸 🤹 🤺 🤻 🤼 🤽 🤾 🤿
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default FeelingDialog;
