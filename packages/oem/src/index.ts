import cli from "@oem/cli";
// import oem from "@oem/core";
import configure from "@oem/config";

const index = async () => {
  const { config, directory } = await configure();
  await cli(config, directory);
  // await oem(command, config, dir);
};

index();
