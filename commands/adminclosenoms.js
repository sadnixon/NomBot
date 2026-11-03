'use strict';

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('adminclosenoms')
  .setDescription('Close the nomination window');

async function execute(interaction, user) {
  await interaction.deferReply({ ephemeral: true });
  // Only authorized users can authorize other users
  if (!user.isAuthorized) {
    return interaction.editReply({
      content: 'ADMIN ONLY COMMAND',
      ephemeral: true,
    });
  }

  const nomsOpen = await gameInfo.get('nomsOpen');

  if (nomsOpen) {
    await gameInfo.set('nomsOpen', false);

    await interaction.editReply({
      content: `The nominations are now closed.`,
      ephemeral: true,
    });
  } else {

    await interaction.editReply({
      content: `The nominations are already closed.`,
      ephemeral: true,
    });
  }
}

module.exports = {
  data,
  execute,
};
