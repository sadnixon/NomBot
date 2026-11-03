const {
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const _ = require('lodash');
const { generateCombination } = require('gfycat-style-urls');

const errorMessage = (message) => {
  return {
    embeds: [new EmbedBuilder().setDescription(message).setColor('#ff0000')],
  };
};

const colorMap = {
  Resistance: '#0087d6',
  resistance: '#0087d6',
  Spy: '#fc4141',
  spy: '#fc4141',
  Neutral: '#7f7f7f',
};

const standardEmbed = (header, message, team = 'Neutral') => {
  return {
    embeds: [
      new EmbedBuilder()
        .setTitle(header)
        .setDescription(message)
        .setColor(colorMap[team]),
    ],
  };
};

module.exports = {
  errorMessage,
  standardEmbed,
};
