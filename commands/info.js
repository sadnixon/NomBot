'use strict';

const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Show information about available commands');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  const embed = new EmbedBuilder().setTitle('Commands').addFields(
    {
      name: '/nominate',
      value: 'This nominates a player to be on the block',
    },
    {
      name: '/vote',
      value: 'This votes for a player who is on the block',
    },
    {
      name: '/unvote',
      value: 'This unvotes for a player who is on the block',
    },
    {
      name: '/nomstate',
      value: 'This shows the state of the nominations and votes from your perspective',
    },
    {
      name: '/info',
      value: 'Show this help message.',
    },
  );

  await interaction.editReply({
    embeds: [embed],
  });
}

module.exports = {
  data,
  execute,
};
