var Netgear = require('netgear');
var _ = require('underscore');

module.exports = function (RED) {
    function NetgearAllDevices(config) {

        RED.nodes.createNode(this, config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function (msg) {


            //const Netgear = require('netgear');
            const options = { password: this.creds.password, host: this.creds.host };
            //console.log("options: " , options);

            if(this.password === "" || this.host === "") {
                msg.payload = "ERROR: password or host emtpy.";
                node.send(msg);

            }
            else {

                (async () => {
                    //console.log("Status: " + await getDevices())
                    let devArr = await getDevices(options);
                    msg.payload = devArr;
                    node.send(msg);
                })()


            }


        });
    }
    RED.nodes.registerType('netgear-all-devices', NetgearAllDevices);

    function NetgearConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.password = n.password;
        this.host = n.host;
    }
    RED.nodes.registerType('netgear-config-node', NetgearConfigNode);

};


async function getDevices(options) {
    try {
        const router = new Netgear();
        await router.login(options);
        const deviceArray = await router.getAttachedDevices();
        //console.log(deviceArray);
        return (deviceArray);
    } catch (error) {
        //console.log(error);
        return (error);
    }
}