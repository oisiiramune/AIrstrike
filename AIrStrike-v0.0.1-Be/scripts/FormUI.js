import { system, Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

function showModalForm(player) {
    const form = new ModalFormData();
    form.title("§4Call Airstrike")
        .textField("x", "§6Drop Point X")
        .textField("z", "§6Drop Point Z")
        .dropdown("type", ["Cluster", "Napalm", "MOAB", "General", "Bunker Buster", "White phosphorus", "Sarin", "Nuke(Gravity)", "Nuke(ICBM)"])

        .show(player).then(re => {
            if (re.canceled) {
                return;
            }

            const x = parseFloat(re.formValues[0]);
            const z = parseFloat(re.formValues[1]);

            if (isNaN(x) || isNaN(z)) {
                player.runCommand('say Its Not available answer.');
                return;
            }

            system.run(() => { 
                player.runCommand(`title @a actionbar Detected unknown aircraft.`);
                player.startItemCooldown("onFire", 555);
                player.runCommand(`summon ais:b61 ${x} 350 ${z} ~~`);
            });
        });
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        "ais:Remocon",
        {
            onUse({ source }) {
                showModalForm(source);
            }
        }
    );
});