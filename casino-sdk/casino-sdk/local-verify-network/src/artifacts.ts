// Vendored from the verify-network-effect repo (packages/contracts Hardhat artifacts) by
// scripts/vendor-artifacts.ts. ABI + creation bytecode only; do not edit by hand.
import type { Hex } from 'viem';

export const routerAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AccessControl__Unauthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__InvalidInitializationParameters',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__RemoveTargetNotZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__ReplaceTargetIsIdentical',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__SelectorAlreadyAdded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__SelectorIsImmutable',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__SelectorNotFound',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__SelectorNotSpecified',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DiamondProxyWritable__TargetHasNoCode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Introspectable__InvalidInterfaceId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Ownable__NotOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Ownable__NotTransitiveOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Proxy__ImplementationIsNotContract',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Proxy__SenderIsNotAdmin',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'enum _IERC2535DiamondCut.FacetCutAction',
            name: 'action',
            type: 'uint8',
          },
          {
            internalType: 'bytes4[]',
            name: 'selectors',
            type: 'bytes4[]',
          },
        ],
        indexed: false,
        internalType: 'struct _IERC2535DiamondCut.FacetCut[]',
        name: 'facetCuts',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'DiamondCut',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'enum _IERC2535DiamondCut.FacetCutAction',
            name: 'action',
            type: 'uint8',
          },
          {
            internalType: 'bytes4[]',
            name: 'selectors',
            type: 'bytes4[]',
          },
        ],
        internalType: 'struct _IERC2535DiamondCut.FacetCut[]',
        name: 'facetCuts',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'diamondCut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'selector',
        type: 'bytes4',
      },
    ],
    name: 'facetAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'facet',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'facetAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: 'addresses',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'facet',
        type: 'address',
      },
    ],
    name: 'facetFunctionSelectors',
    outputs: [
      {
        internalType: 'bytes4[]',
        name: 'selectors',
        type: 'bytes4[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'facets',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'bytes4[]',
            name: 'selectors',
            type: 'bytes4[]',
          },
        ],
        internalType: 'struct _IERC2535DiamondLoupe.Facet[]',
        name: 'diamondFacets',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFallbackAddress',
    outputs: [
      {
        internalType: 'address',
        name: 'fallbackAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fallbackAddress',
        type: 'address',
      },
    ],
    name: 'setFallbackAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;

export const routerBytecode: Hex =
  '0x6080604052346102875761025e6100146102e8565b61002c6100208261033c565b632c40805960e01b9052565b6101d56101c961003c6001610306565b61005661004a60018661034e565b639142376560e01b9052565b632f40adcf60e21b5f525f5160206123845f395f51905f526020527f2de04b09b31861ec8d744fd1bfe2904fc9ab3890fe7ec6d0f7c4b941ed8d5822805460ff191660011790556100bf6100b36100ac83610306565b928661034e565b6307e4c70760e21b9052565b6307e4c70760e21b5f525f5160206123845f395f51905f526020527f6c1339b8848595ebb2d0eb2c445356084ad3fc2fe46b7898f4abf3e0d5b280c2805460ff191660011790556101216101156100ac83610306565b637a0ed62760e01b9052565b61013c6101306100ac83610306565b6356fe50af60e11b9052565b61015761014b6100ac83610306565b6314bbdacb60e21b9052565b6101726101666100ac83610306565b6366ffd66360e11b9052565b6348e2b09360e01b5f525f5160206123845f395f51905f526020527f7661afff1a97d0ec2e1a9ce3077c6e2019badf127f248508204a29c4f830a08b805460ff191660011790556101c281610306565b508361034e565b6301ffc9a760e01b9052565b6301ffc9a760e01b5f525f5160206123845f395f51905f526020527fa8f5d028d766a70d3486bcf0e3a439c4887bbbbcbedea7130e385c503d65c974805460ff19166001179055610224610362565b9061022d61029f565b308152905f602083015260408201526102458261033c565b5261024f8161033c565b506102586103e5565b90610605565b610267336104b1565b610270336103f5565b610278610479565b6040516115989081610d8c8239f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b60405190606082016001600160401b038111838210176102be57604052565b61028b565b6040519190601f01601f191682016001600160401b038111838210176102be57604052565b610120906102f5826102c3565b6008815291601f1901366020840137565b5f1981146103145760010190565b634e487b7160e01b5f52601160045260245ffd5b634e487b7160e01b5f52603260045260245ffd5b8051156103495760200190565b610328565b80518210156103495760209160051b010190565b60409061036e826102c3565b6001815291601f1901825f5b82811061038657505050565b60209061039161029f565b5f81525f83820152606060408201528282850101520161037a565b600311156103b657565b634e487b7160e01b5f52602160045260245ffd5b6001600160401b0381116102be57601f01601f191660200190565b6103ef60206102c3565b905f8252565b5f80527f409a779b06f7ed4482e4a4bbaf0e0febf249036642c5bc5fb6c71bf2a72d5d00602052610446817f66284c0762af713e202e0524bbf74efcdaa2baaf6286c0a3c4935fba6071c3306107b6565b5033906001600160a01b03165f7f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d8180a4565b5f5f5160206123445f395f51905f525f5160206123245f395f51905f52604060018060a01b038354168151908152846020820152a155565b5f5160206123445f395f51905f528054604080516001600160a01b0392831681529390911660208401819052925f5160206123245f395f51905f529190a155565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9392909193606081016060825283518091526080820190602060808260051b8501019501915f905b82821061056f575050506001600160a01b03909516602082015292935061056c9260408184039101526104f2565b90565b848703607f19018152835180516001600160a01b0316885260208101519497939492939192606083019160038210156103b657604060809160209384870152015193606060408201528451809452019201905f905b8082106105e25750505060208060019298019201920190929161053e565b82516001600160e01b0319168452602093840193909201916001909101906105c4565b919061062a6106235f5160206123a45f395f51905f525461ffff1690565b61ffff1690565b9283925f92600786166107a0575b5f94935b83518610156106fb5761064f868561034e565b51602081015161065e816103ac565b604082015151156106ec57610672816103ac565b80610693575090600195969761068792610ba5565b9490965b01949361063c565b6106a081989397986103ac565b600181036106ba5750906106b5600192610aa4565b61068b565b806106c66002926103ac565b146106d5575b5060019061068b565b946106e3919760019661082e565b949096906106cc565b6309547f0d60e11b5f5260045ffd5b61075295505f92967f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673949295810361077e575b60078116610754575b50506107498460405193849384610516565b0390a15f610d19565b565b6107769060031c5b5f525f5160206123c45f395f51905f5260205260405f2090565b555f80610737565b5f5160206123a45f395f51905f52805461ffff191661ffff831617905561072e565b92506107af61075c8660031c90565b5492610638565b9060018060a01b03165f916001810190825f528160205260405f2054156107de575b50505090565b809192935054680100000000000000008110156102be5760018101808355811015610349575f828152602080822092909201859055915493825291909152604081209190915560019080806107d8565b8051929390929091906001600160a01b0316610a95575f935b6040840151918251861015610a8e5761086786610875925f19019461034e565b516001600160e01b03191690565b6001600160e01b031981165f9081525f5160206123645f395f51905f5260205260408120805491905591606083901c8015610a7f573014610a70576007841660078114610a35575b816108cb6108d89260051b90565b1b63ffffffff60e01b1690565b916001600160e01b0319908116908316036109b3575b6109116106236007610905600387901c611fff1683565b951660051b61ffe01690565b9261091c8560031c90565b810361094957506040926001926001600160e01b031980831c199093169216901c17955b01949050610847565b6109ad610991604095600195610977855f5160206123c45f395f51905f529d979d905f5260205260405f2090565b546001600160e01b031980841c19909116911690911c1790565b915f5160206123c45f395f51905f52905f5260205260405f2090565b55610940565b6109fc6109ef6109e1845f5160206123645f395f51905f529063ffffffff60e01b165f5260205260405f2090565b546001600160601b03191690565b6001600160601b03191690565b6001600160e01b031983165f9081525f5160206123645f395f51905f52602052604090206001600160601b0385169190911790556108ee565b6108cb91506108d890610a66610a4b8760031c90565b5f5160206123c45f395f51905f52905f5260205260405f2090565b54925090506108bd565b631cbd473560e21b5f5260045ffd5b63273f579560e21b5f5260045ffd5b9450925050565b6305d49e0f60e41b5f5260045ffd5b80519091906001600160a01b03163b15610b96575f5b60408301518051821015610b905761086782610ad59261034e565b90610afe825f5160206123645f395f51905f529063ffffffff60e01b165f5260205260405f2090565b54918260601c8015610a7f57308114610a705785516001600160a01b031614610b81578451600193610b7a91610b4c906109ef906001600160a01b03165b60601b6001600160601b03191690565b90858060601b031617915f5160206123645f395f51905f529063ffffffff60e01b165f5260205260405f2090565b5501610aba565b631e1edc6960e11b5f5260045ffd5b50509050565b63753f216760e01b5f5260045ffd5b80519293929091906001600160a01b0316803b15610cd1575081516001600160a01b03166001600160a01b03163014610a70575b5f905b60408301518051831015610cc95761086783610bf79261034e565b94610c20865f5160206123645f395f51905f529063ffffffff60e01b165f5260205260405f2090565b54610cba5760019160e0610c968493610c456109ef610b3c8a5160018060a01b031690565b8417610c6f8b5f5160206123645f395f51905f529063ffffffff60e01b165f5260205260405f2090565b55610c7d6007851660051b90565b996001600160e01b0319808c1c1990921691168a1c1790565b9714610ca6575b01910190610bdc565b86610cb4610a4b8360031c90565b55610c9d565b6348d42e7f60e11b5f5260045ffd5b509150509190565b6001600160a01b03163014610bd95763753f216760e01b5f5260045ffd5b3d15610d14573d90610d08610d03836103ca565b6102c3565b9182523d5f602084013e565b606090565b81516001600160a01b03821690811590158118610d7c5715610d3a57505050565b3003610d67575b815f929160208493519201905af4610d57610cef565b5015610d5f57565b3d5f803e3d5ffd5b803b610d415763753f216760e01b5f5260045ffd5b63cf45f9c560e01b5f5260045ffdfe60806040526004361015610018575b36610dd557610dd5565b5f3560e01c806301ffc9a7146100975780631f931c1c146100925780632c4080591461008d57806352ef6b2c146100885780637a0ed62714610083578063914237651461007e578063adfca15e146100795763cdffacc60361000e576108f7565b6107f0565b61074b565b6104e2565b6102ad565b610224565b610197565b346100f95760203660031901126100f957602060ff6100ed6100b76100fd565b63ffffffff60e01b165f527ffe25b4374cb2b280904a684bb2057f9f429754d871a6b258ad16536918fdbd0060205260405f2090565b54166040519015158152f35b5f80fd5b600435906001600160e01b0319821682036100f957565b35906001600160e01b0319821682036100f957565b602435906001600160a01b03821682036100f957565b600435906001600160a01b03821682036100f957565b35906001600160a01b03821682036100f957565b9181601f840112156100f95782359167ffffffffffffffff83116100f957602083818601950101116100f957565b346100f95760603660031901126100f95760043567ffffffffffffffff81116100f957366023820112156100f95780600401359067ffffffffffffffff82116100f9573660248360051b830101116100f9576101f1610129565b906044359167ffffffffffffffff83116100f957610222936102196024943690600401610169565b949093016109e4565b005b346100f9575f3660031901126100f9577f85fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f203546040516001600160a01b039091168152602090f35b60206040818301928281528451809452019201905f5b81811061028e5750505090565b82516001600160a01b0316845260209384019390920191600101610281565b346100f9575f3660031901126100f9576102e06102d95f5160206115235f395f51905f525461ffff1690565b61ffff1690565b6102e981610cb6565b5f5f5f5b8482106103095782845260405180610305868261026b565b0390f35b61031281610d05565b545f5b6008811061032e575b505061032990610cf2565b6102ed565b91949261033d90969196610cf2565b938185116104225761038261037c61036e6103698a61035c8860051b90565b1b63ffffffff60e01b1690565b610af6565b546001600160601b03191690565b60601c90565b5f6001600160a01b038216815b8481106103df575b50506103d557816103c06103c5926103b160019589610d45565b6001600160a01b039091169052565b610cf2565b925b019590959491939294610315565b50916001906103c7565b6104086103fc6103ef838b610d45565b516001600160a01b031690565b6001600160a01b031690565b82146104165760010161038f565b50505060015f80610397565b9392949181965061031e565b90602080835192838152019201905f5b81811061044b5750505090565b82516001600160e01b03191684526020938401939092019160010161043e565b602081016020825282518091526040820191602060408360051b8301019401925f915b83831061049d57505050505090565b90919293946020806104d3600193603f198682030187526040838b51878060a01b0381511684520151918185820152019061042e565b9701930193019193929061048e565b346100f9575f3660031901126100f95761050e6102d95f5160206115235f395f51905f525461ffff1690565b61051781610d59565b61052082610cb6565b915f905f5f5b828210610580575050505f5b81811061054a5781835260405180610305858261046b565b8061056a61056461055d60019488610d45565b5160ff1690565b60ff1690565b60206105768387610d45565b5101515201610532565b61058981610d05565b545f5b600881106105a5575b50506105a090610cf2565b610526565b926105b69097949197969296610cf2565b9481861161073d576105cc8861035c8660051b90565b6105db61037c61036e83610af6565b5f6001600160a01b038216815b85811061068d575b5050610682579161065d6106709261061e60019561060e858a610d45565b516001600160a01b039091169052565b61062786610cb6565b6020610633858a610d45565b51015261064d6020610645858a610d45565b510151610d33565b6001600160e01b03199091169052565b6103c061066a8289610d45565b60019052565b935b019690939695919594929461058c565b505092600190610672565b898589846106af6103fc6106a18785610d45565b51516001600160a01b031690565b146106bf575050506001016105e8565b610734955083945061055d8460ff94610701869561064d60206106e861070d9b61070699610d45565b5101516106fb61056461055d8888610d45565b90610d45565b610d45565b1610610dbd565b61072c61072561072061055d848d610d45565b610dc4565b918a610d45565b9060ff169052565b60015f806105f0565b949281949750959195610595565b346100f95760203660031901126100f95761076461013f565b61076c610e6a565b7f85fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f20380546001600160a01b0319166001600160a01b0392909216919091179055005b60206040818301928281528451809452019201905f5b8181106107d05750505090565b82516001600160e01b0319168452602093840193909201916001016107c3565b346100f95760203660031901126100f95761080961013f565b6108256102d95f5160206115235f395f51905f525461ffff1690565b9061082f82610cb6565b905f906001600160a01b031681805b858210610856578385526040518061030587826107ad565b61085f81610d05565b545f5b6008811061087b575b505061087690610cf2565b61083e565b949261088c90979197969296610cf2565b948186116108e9576108a28861035c8360051b90565b6108b46103fc61037c61036e84610af6565b86146108cd575b50600101969096959195949294610862565b846103c06108e29261064d6001959888610d45565b93906108bb565b81975095919594929461086b565b346100f95760203660031901126100f95760206109156103696100fd565b5460601c604051908152f35b634e487b7160e01b5f52604160045260245ffd5b604051906060820182811067ffffffffffffffff82111761095557604052565b610921565b6040519190601f01601f1916820167ffffffffffffffff81118382101761095557604052565b67ffffffffffffffff81116109555760051b60200190565b67ffffffffffffffff811161095557601f01601f191660200190565b9291926109c86109c383610998565b61095a565b93828552828201116100f957815f926020928387013784010152565b929493906109f46109c382610980565b93602085838152019160051b8101903682116100f95780925b828410610a305750505050610a2e9394610a289136916109b4565b91610b19565b565b833567ffffffffffffffff81116100f95782016060813603126100f957610a55610935565b90610a5f81610155565b8252602081013560038110156100f957602083015260408101359067ffffffffffffffff82116100f9570136601f820112156100f957803590610aa46109c383610980565b9160208084838152019160051b830101913683116100f957602001905b828210610ade575050506040820152815260209384019301610a0d565b60208091610aeb84610114565b815201910190610ac1565b63ffffffff60e01b165f525f5160206115035f395f51905f5260205260405f2090565b610b21610e6a565b610b3d6102d95f5160206115235f395f51905f525461ffff1690565b9384935f9360078716610ca0575b5f95945b8451871015610c0e57610b628786610d45565b516020810151610b7181610eb6565b60408201515115610bff57610b8581610eb6565b80610ba65750906001969798610b9a92611321565b9590975b019594610b4f565b610bb38199939899610eb6565b60018103610bcd575090610bc860019261120f565b610b9e565b80610bd9600292610eb6565b14610be8575b50600190610b9e565b95610bf69198600197610faf565b95909790610bdf565b6309547f0d60e11b5f5260045ffd5b610a2e96507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb673939782959293968103610c7e575b60078116610c65575b5050610c5d8560405193849384610ef8565b0390a1611490565b610c769060031c610d05565b610d05565b555f80610c4b565b5f5160206115235f395f51905f52805461ffff191661ffff8316179055610c42565b9350610caf610c718760031c90565b5493610b4b565b90610cc36109c383610980565b8281528092610cd4601f1991610980565b0190602036910137565b634e487b7160e01b5f52601160045260245ffd5b5f198114610d005760010190565b610cde565b5f525f5160206115435f395f51905f5260205260405f2090565b634e487b7160e01b5f52603260045260245ffd5b805115610d405760200190565b610d1f565b8051821015610d405760209160051b010190565b90610d666109c383610980565b8281528092610d77601f1991610980565b015f5b818110610d8657505050565b60405190604082019180831067ffffffffffffffff841117610955576020926040525f815260608382015282828601015201610d7a565b156100f957565b60ff1660ff8114610d005760010190565b5f80356001600160e01b03191681525f5160206115035f395f51905f52602052604090205460601c8015610e39575b365f80375f803681845af43d5f803e15610e35573d610e31573b610e31576321f27f0d60e21b5f5260045ffd5b3d5ff35b3d5ffd5b507f85fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f203546001600160a01b0316610e04565b335f9081527f66284c0762af713e202e0524bbf74efcdaa2baaf6286c0a3c4935fba6071c331602052604090205415610e9f57565b630c4705d560e01b5f525f6004523360245260445ffd5b60031115610ec057565b634e487b7160e01b5f52602160045260245ffd5b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b93929091936060810160608252835180915260808201602060808360051b8501019501915f5b818110610f4f575050506001600160a01b039095166020820152929350610f4c926040818403910152610ed4565b90565b848703607f19018352835180516001600160a01b031688526020810151949793949293919291906003831015610ec057610fa38260606040602095946001978780970152015191816040820152019061042e565b98019401929101610f1e565b8051929390929091906001600160a01b0316611200575f935b60408401519182518610156111f957610fe886610ff6925f190194610d45565b516001600160e01b03191690565b6001600160e01b031981165f9081525f5160206115035f395f51905f5260205260408120805491905591606083901c80156111ea5730146111db5760078416600781146111a0575b8161035c61104c9260051b90565b916001600160e01b031990811690831603611127575b6110856102d96007611079600387901c611fff1683565b951660051b61ffe01690565b926110908560031c90565b81036110bd57506040926001926001600160e01b031980831c199093169216901c17955b01949050610fc8565b6111216111056040956001956110eb855f5160206115435f395f51905f529d979d905f5260205260405f2090565b546001600160e01b031980841c19909116911690911c1790565b915f5160206115435f395f51905f52905f5260205260405f2090565b556110b4565b61116261115561036e845f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b6001600160601b03191690565b6bffffffffffffffffffffffff84161761119a835f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b55611062565b61035c915061104c906111d16111b68760031c90565b5f5160206115435f395f51905f52905f5260205260405f2090565b549250905061103e565b631cbd473560e21b5f5260045ffd5b63273f579560e21b5f5260045ffd5b9450925050565b6305d49e0f60e41b5f5260045ffd5b80519091906001600160a01b03163b15611312575f5b6040830151805182101561130c57610fe88261124092610d45565b90611269825f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b54918260601c80156111ea573081146111db578551611290906001600160a01b03166103fc565b146112fd5784516001936112f6916bffffffffffffffffffffffff906112ce90611155906001600160a01b03165b60601b6001600160601b03191690565b911617915f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b5501611225565b631e1edc6960e11b5f5260045ffd5b50509050565b63753f216760e01b5f5260045ffd5b80519293929091906001600160a01b0316803b1561144d575081516001600160a01b03166001600160a01b031630146111db575b5f905b6040830151805183101561144557610fe88361137392610d45565b9461139c865f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b546114365760019160e061141284936113c16111556112be8a5160018060a01b031690565b84176113eb8b5f5160206115035f395f51905f529063ffffffff60e01b165f5260205260405f2090565b556113f96007851660051b90565b996001600160e01b0319808c1c1990921691168a1c1790565b9714611422575b01910190611358565b866114306111b68360031c90565b55611419565b6348d42e7f60e11b5f5260045ffd5b509150509190565b6001600160a01b031630146113555763753f216760e01b5f5260045ffd5b3d1561148b573d9061147f6109c383610998565b9182523d5f602084013e565b606090565b81516001600160a01b038216908115901581186114f357156114b157505050565b30036114de575b815f929160208493519201905af46114ce61146b565b50156114d657565b3d5f803e3d5ffd5b803b6114b85763753f216760e01b5f5260045ffd5b63cf45f9c560e01b5f5260045ffdfe85fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f20085fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f20185fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f202a264697066735822122073a72229906f251001f239ea21c511f8f3c4792d83b8b35dea43e8feb445c31f64736f6c634300082400337e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610385fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f200fe25b4374cb2b280904a684bb2057f9f429754d871a6b258ad16536918fdbd0085fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f20185fb9346809a0d51894362fd6f50e7a5ba84526939921b0ff59f80250a25f202';

export const routerInitAbi = [
  {
    inputs: [],
    name: 'Initializable__AlreadyInitialized',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'VerifierWithoutCode',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'contract IEnclaveAttestationVerifier',
        name: 'attestationVerifier',
        type: 'address',
      },
      {
        internalType: 'contract IECVRFVerifier',
        name: 'ecvrfVerifier',
        type: 'address',
      },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const routerInitBytecode: Hex =
  '0x60808060405234601557610322908161001a8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f3560e01c63f09a401614610025575f80fd5b3461028a57604036600319011261028a576004356001600160a01b0381169081900361028a576024356001600160a01b038116929083900361028a577f3ad28da30acbefd470118e3dbae81a490030b0b23b7e1445ed9d236b8053050054600160ff8216101561027b577f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249891600160209260ff1916177f3ad28da30acbefd470118e3dbae81a490030b0b23b7e1445ed9d236b805305005560018152a15f60806100ed61028e565b8281528260208201528260408201528260608201520152620f4240608061011261028e565b601481526202bf20602082015261bb8060408201526060810183905201527f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6a805471ffffffffffffffffffffffffffffffffffff1916700f4240000f42400000bb800002bf20001417905566038d7ea4c680007f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6b556001600160a01b03906101b9906102c2565b166bffffffffffffffffffffffff60a01b7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c5416177f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c5561022060018060a01b03916102c2565b166bffffffffffffffffffffffff60a01b7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d5416177f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d555f80f35b6317456d5560e11b5f5260045ffd5b5f80fd5b6040519060a0820182811067ffffffffffffffff8211176102ae57604052565b634e487b7160e01b5f52604160045260245ffd5b803b156102cc5790565b632f19278760e11b5f9081526001600160a01b0391909116600452602490fdfea264697066735822122062061e003ca199c1b4c273628692be4920198ce80fcbdfda8274075fb0ee7dcb64736f6c63430008240033';

export const vrfFacetAbi = [
  {
    inputs: [],
    name: 'AllNodesAtCapacity',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'max',
        type: 'uint256',
      },
    ],
    name: 'CallbackDataTooLong',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'callbackGasLimit',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'max',
        type: 'uint32',
      },
    ],
    name: 'CallbackGasLimitTooHigh',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    name: 'ChallengeInconclusive',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    name: 'ChallengeRejected',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'available',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'InsufficientFulfillmentGas',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidEnclaveSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoActiveNodes',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'NoStake',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    name: 'RequestClosed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'staleAt',
        type: 'uint256',
      },
    ],
    name: 'RequestNotStale',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'bits',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'max',
        type: 'uint256',
      },
    ],
    name: 'TooManySequences',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'UnknownNode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    name: 'UnknownRequest',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'ValueBelowFee',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'challenger',
        type: 'address',
      },
    ],
    name: 'FulfillmentChallenged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    name: 'NodeEjected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stake',
        type: 'uint256',
      },
    ],
    name: 'NodeSlashed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'reason',
        type: 'bytes',
      },
    ],
    name: 'RandomnessCallbackFailed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'randomness',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256[4]',
        name: 'proof',
        type: 'uint256[4]',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'enclaveSignature',
        type: 'bytes',
      },
    ],
    name: 'RandomnessFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'consumer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fulfiller',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'consumer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'sequence',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'fulfiller',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'assignedAt',
            type: 'uint40',
          },
          {
            internalType: 'uint96',
            name: 'fee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'gasPrice',
            type: 'uint96',
          },
          {
            internalType: 'uint32',
            name: 'callbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        indexed: false,
        internalType: 'struct Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'RandomnessRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint96',
        name: 'charged',
        type: 'uint96',
      },
      {
        indexed: false,
        internalType: 'uint96',
        name: 'refunded',
        type: 'uint96',
      },
    ],
    name: 'RequestSettled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'consumer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'fulfiller',
        type: 'address',
      },
    ],
    name: 'StaleRequestReported',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'consumer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'sequence',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'fulfiller',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'assignedAt',
            type: 'uint40',
          },
          {
            internalType: 'uint96',
            name: 'fee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'gasPrice',
            type: 'uint96',
          },
          {
            internalType: 'uint32',
            name: 'callbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Request',
        name: 'request',
        type: 'tuple',
      },
      {
        internalType: 'uint256[4]',
        name: 'proof',
        type: 'uint256[4]',
      },
      {
        internalType: 'bytes',
        name: 'enclaveSignature',
        type: 'bytes',
      },
    ],
    name: 'challengeFulfillment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'consumer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'sequence',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'fulfiller',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'assignedAt',
            type: 'uint40',
          },
          {
            internalType: 'uint96',
            name: 'fee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'gasPrice',
            type: 'uint96',
          },
          {
            internalType: 'uint32',
            name: 'callbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'computeRequestId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'consumer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'sequence',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'fulfiller',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'assignedAt',
            type: 'uint40',
          },
          {
            internalType: 'uint96',
            name: 'fee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'gasPrice',
            type: 'uint96',
          },
          {
            internalType: 'uint32',
            name: 'callbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Request',
        name: 'request',
        type: 'tuple',
      },
      {
        internalType: 'uint256[4]',
        name: 'proof',
        type: 'uint256[4]',
      },
      {
        internalType: 'bytes',
        name: 'enclaveSignature',
        type: 'bytes',
      },
    ],
    name: 'fulfillRandomness',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'consumer',
                type: 'address',
              },
              {
                internalType: 'uint64',
                name: 'sequence',
                type: 'uint64',
              },
              {
                internalType: 'address',
                name: 'fulfiller',
                type: 'address',
              },
              {
                internalType: 'uint40',
                name: 'assignedAt',
                type: 'uint40',
              },
              {
                internalType: 'uint96',
                name: 'fee',
                type: 'uint96',
              },
              {
                internalType: 'uint96',
                name: 'gasPrice',
                type: 'uint96',
              },
              {
                internalType: 'uint32',
                name: 'callbackGasLimit',
                type: 'uint32',
              },
              {
                internalType: 'bytes',
                name: 'callbackData',
                type: 'bytes',
              },
            ],
            internalType: 'struct Request',
            name: 'request',
            type: 'tuple',
          },
          {
            internalType: 'uint256[4]',
            name: 'proof',
            type: 'uint256[4]',
          },
          {
            internalType: 'bytes',
            name: 'enclaveSignature',
            type: 'bytes',
          },
        ],
        internalType: 'struct Fulfillment[]',
        name: 'fulfillments',
        type: 'tuple[]',
      },
    ],
    name: 'fulfillRandomnessBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'consumer',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'sequence',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'fulfiller',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'assignedAt',
            type: 'uint40',
          },
          {
            internalType: 'uint96',
            name: 'fee',
            type: 'uint96',
          },
          {
            internalType: 'uint96',
            name: 'gasPrice',
            type: 'uint96',
          },
          {
            internalType: 'uint32',
            name: 'callbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Request',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'reportStaleRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'sequence',
        type: 'uint64',
      },
    ],
    name: 'requestIdOf',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'sequences',
        type: 'uint64[]',
      },
    ],
    name: 'requestIdsOf',
    outputs: [
      {
        internalType: 'bytes32[]',
        name: 'ids',
        type: 'bytes32[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
      {
        internalType: 'uint32',
        name: 'callbackGasLimit',
        type: 'uint32',
      },
    ],
    name: 'requestRandomness',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    name: 'requestRandomness',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const vrfFacetBytecode: Hex =
  '0x60808060405234601557611faa908161001a8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c8063249e7966146103c1578063397e8407146103445780634a747f291461031f5780634f27081d1461030857806350eb05bb146101fb57806370e519ea146101c3578063a837e837146100eb578063b93b4fed146100d35763e6dee7ed1461007c575f80fd5b60203660031901126100cf576004356001600160401b0381116100cf576100c76100ac602092369060040161052b565b906100b5610879565b9163ffffffff60608401511691611080565b604051908152f35b5f80fd5b346100cf576100e96100e4366105b5565b610989565b005b346100cf5760203660031901126100cf576004356001600160401b0381116100cf5761011b9036906004016105e9565b6040513683900360be1901905f5b838110156100e957816040525a908060051b86013591848312156100cf5760019287016101676101623661015d848061091c565b61079f565b610b28565b9081610186610181602061017b858061091c565b01610908565b6118b5565b54036101bb576101b59260209261019d838061091c565b906101ab60a0850185610931565b9590940192611435565b01610129565b5050506101b5565b346100cf5760203660031901126100cf576004356001600160401b03811681036100cf576101f26020916118b5565b54604051908152f35b346100cf5760203660031901126100cf576004356001600160401b0381116100cf5761022b9036906004016105e9565b6101f481116102f05761023d816108f1565b61024a6040519182610705565b818152610256826108f1565b6020820190601f19013682375f5b838110156102ac578060051b9061027f610181838801610908565b5484518210156102985760206001938601015201610264565b634e487b7160e01b5f52603260045260245ffd5b5090604051918291602083019060208452518091526040830191905f5b8181106102d7575050500390f35b82518452859450602093840193909201916001016102c9565b634583b14960e11b5f526004526101f460245260445ffd5b346100cf5760206100c76101623661015d366105b5565b346100cf576100e961033036610558565b929190915a61033e826113c1565b90611435565b60403660031901126100cf576004356001600160401b0381116100cf5761036f90369060040161052b565b6024359063ffffffff8216928383036100cf5761038a610879565b9363ffffffff608086015116908181116103ac5760206100c787878787611080565b631aaf7a3960e31b5f5260045260245260445ffd5b346100cf576103cf36610558565b926103df60408294939401610619565b936103e98561062d565b541580156104f7575b6104d95761040761016261041093369061079f565b93838587610c0c565b6001600160a01b0383165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b766602052604090209082604051805f905b600282106104bf57505061046e9350610469604082610705565b610db9565b6104ad5761047b82610f0a565b33916001600160a01b0316907f24ea7f05b6d88add6416ea559acc12c38d99f4819657f6d97375749b4d1fd7f15f80a4005b63022e577d60e01b5f5260045260245ffd5b85548152600195860195879450919091019060200161044f565b63089858e760e11b5f9081526001600160a01b038616600452602490fd5b506001600160a01b0385165f9081525f516020611f355f395f51905f52602052604090206105259083610b08565b156103f2565b9181601f840112156100cf578235916001600160401b0383116100cf57602083818601950101116100cf57565b60c06003198201126100cf576004356001600160401b0381116100cf5761010081830360031901126100cf57600401918160a4116100cf5760249160a435906001600160401b0382116100cf576105b19160040161052b565b9091565b60206003198201126100cf57600435906001600160401b0382116100cf576101009082900360031901126100cf5760040190565b9181601f840112156100cf578235916001600160401b0383116100cf576020808501948460051b0101116100cf57565b356001600160a01b03811681036100cf5790565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7656020526040902090565b6001600160a01b03165f9081527f20d409567c11d0919b4e92edadabde986fedc1be9872cbd35d9bd2797c19df016020526040902090565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7676020526040902090565b61010081019081106001600160401b038211176106f157604052565b634e487b7160e01b5f52604160045260245ffd5b90601f801991011681019081106001600160401b038211176106f157604052565b35906001600160a01b03821682036100cf57565b35906001600160601b03821682036100cf57565b6001600160401b0381116106f157601f01601f191660200190565b9291926107758261074e565b916107836040519384610705565b8294818452818301116100cf578281602093845f960137010152565b9190610100838203126100cf57604051906107b9826106d5565b81936107c481610726565b835260208101356001600160401b03811681036100cf5760208401526107ec60408201610726565b6040840152606081013564ffffffffff811681036100cf5760608401526108156080820161073a565b608084015261082660a0820161073a565b60a084015260c081013563ffffffff811681036100cf5760c084015260e0810135906001600160401b0382116100cf570181601f820112156100cf5760e09181602061087493359101610769565b910152565b6040519060a082018281106001600160401b038211176106f15760405281608063ffffffff7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6a5461ffff81168452818160101c166020850152818160301c166040850152818160501c16606085015260701c16910152565b6001600160401b0381116106f15760051b60200190565b356001600160401b03811681036100cf5790565b90359060fe19813603018212156100cf570190565b903590601e19813603018212156100cf57018035906001600160401b0382116100cf576020019181360383136100cf57565b3564ffffffffff811681036100cf5790565b356001600160601b03811681036100cf5790565b610992816113c1565b606082016109a76109a282610963565b6118eb565b4210610ae6576040830192610a756109e66109c186610619565b6001600160a01b03165f9081525f516020611f355f395f51905f526020526040902090565b826109f2828095611900565b6109fb81610619565b610a24610a1c6001600160601b03610a1560808601610975565b1692610665565b918254610ee9565b9055610a2f81610619565b6001600160a01b03610a4089610619565b16906001600160a01b0316877faca250571c2d1a8910e9db8cb146bf3f13fe87b05a51f768a77f1a99db6dada55f80a4610b08565b158015610acd575b610ac757610a9b63ffffffff64ffffffffff925460c81c1692610963565b161015610ab65750610aaf610ab491610619565b610f0a565b565b610ac2610ab492610619565b61196a565b50505050565b50610adf610ada85610619565b61062d565b5415610a7d565b6109a2610af291610963565b9063042cf29f60e41b5f5260045260245260445ffd5b64ffffffffff610b1b6060829301610963565b925460a01c169116101590565b60018060a01b03815116906001600160401b036020820151169060018060a01b036040820151169064ffffffffff6060820151166001600160601b036080830151166001600160601b0360a0840151169160e063ffffffff60c0860151169401516020815191012094604051966020880198468a523060408a01527f7761cd2343be786e645192697256ccf13964ba0842c707c0b5c82927457bbf0360608a0152608089015260a088015260c087015260e08601526101008501526101208401526101408301526101608201526101608152610c0661018082610705565b51902090565b939190610d43939160405160806020820192833760808152610c2f60a082610705565b5190209060405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f7761cd2343be786e645192697256ccf13964ba0842c707c0b5c82927457bbf0360408201527fad7c5bef027816a800da1736444fb58a807ef4c9603b7848673f7e3a68eb14a560608201524660808201523060a082015260a08152610cc560c082610705565b519020916040519060208201927f540d1d4a3b1e015ee1e083d8e0cd77023873121a4337a572f23ea698268fa7f284526040830152606082015260608152610d0e608082610705565b51902060405190602082019261190160f01b84526022830152604282015260428152610d3b606282610705565b519020611a30565b6001600160a01b03918216911603610d5757565b63169ae4bb60e31b5f5260045ffd5b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b3d15610db4573d90610d9b8261074e565b91610da96040519384610705565b82523d5f602084013e565b606090565b9091610dc481611ac3565b9160018060a01b037f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d54169060405185602082015260208152610e08604082610705565b604051632efa56d360e21b81529384925f600485015b60028210610ecf5750505082610e4b6040959360808394604485013760e060c484015260e4830190610d66565b03915afa5f9181610e92575b50610e83575050610e66610d8a565b5115610e7157505f90565b63abb0c06560e01b5f5260045260245ffd5b90915015610e8f571590565b90565b9091506040813d604011610ec7575b81610eae60409383610705565b810103126100cf575180151581036100cf57905f610e57565b3d9150610ea1565b825181528795506020928301926001929092019101610e1e565b91908201809211610ef657565b634e487b7160e01b5f52601160045260245ffd5b6001600160a01b0381165f8181525f516020611f355f395f51905f5260205260409020610f368361062d565b5490805460f81c90600382101561106c5760207f94c1cb5a30eb84463733f8aa89d572686b6f043379602056dd68dc711c674c4791600186941461105e575b610fa0857f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b76854610ee9565b7f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b76855546040519485526001600160a01b031693a35f525f516020611f355f395f51905f526020525f60408120555f610ff78261062d565b556001600160a01b0381165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b766602052604090205f5b600281106110515750506110439061069d565b805464ffffffffff19169055565b5f82820155600101611030565b61106787611b17565b610f75565b634e487b7160e01b5f52602160045260245ffd5b939261400082116113a857483a11156113a1573a925b6110b463ffffffff61ffff8160208601511694511692169283610ee9565b83602802602881048503610ef6576110f79261ffff6110ea6110e4896110df6110f196606498610ee9565b611c5b565b92611c6e565b1690611c5b565b04611d8e565b943461134e576001600160601b038616335f527f20d409567c11d0919b4e92edadabde986fedc1be9872cbd35d9bd2797c19df0160205260405f2054808211611335579061114491611ada565b335f527f20d409567c11d0919b4e92edadabde986fedc1be9872cbd35d9bd2797c19df0160205260405f20555b7fb030fd56553f4f2dae49dfdc45a72f7c3f0ffc51b5ce5d63ba0b79f996fa9ec654916001600160401b038316926001600160401b038414610ef65767ffffffffffffffff19166001600160401b036001850116177fb030fd56553f4f2dae49dfdc45a72f7c3f0ffc51b5ce5d63ba0b79f996fa9ec6556111f183611c9f565b946111fb90611d8e565b60405191611208836106d5565b33835260208301938585526040840197600160a01b6001900316885260608401964264ffffffffff168852608085019a6001600160601b03168b5260a08501936001600160601b0316845260c08501928352369061126592610769565b9160e0840192835261127684610b28565b998a61128281986118b5565b558451895160408051602080825298516001600160a01b039081169982019990995298516001600160401b031690890152995186166060880152975164ffffffffff166080870152516001600160601b0390811660a087015290511660c08501525163ffffffff1660e0840152516101008084015294811694931692819061130f90610120830190610d66565b037ff2c5174f7bafedf8fec01be8e9891a9a5e03354816705041bc09f031a4a8f52491a4565b63db42144d60e01b5f523360045260245260445260645ffd5b6001600160601b03861680341061138b5780341161136d575b50611171565b6113779034611ada565b611383610a1c33610665565b90555f611367565b63c5c2209b60e01b5f523460045260245260445ffd5b4892611096565b5063dbd65ec560e01b5f5260045261400060245260445ffd5b906113de61018160206113d7610162368761079f565b9401610908565b54908282146114115750156113ff57637bbe34c960e01b5f5260045260245ffd5b632edf717f60e01b5f5260045260245ffd5b9050565b908060209392818452848401375f828201840152601f01601f1916010190565b90949193926040850192906001600160a01b0361145185610619565b165f525f516020611f355f395f51905f5260205260405f20948554948560f81c95600387101561106c57861561188c5761148b888a610b08565b15611863579082916114aa8686958d97886114a587610619565b610c0c565b6001600160a01b0316966114be898b611900565b60608a01986114cc8a610963565b81549064ffffffffff63ffffffff8360c81c169116116117fd575b50506002146117d1575b506114fb82611ac3565b9081156116fa57611552907f025b8f33a41b03a003154a46303feddb0716230d10bf9260ebaf559394796d8894955f935b156116ea575b60806040519586958652602086013760c060a085015260c0840191611415565b0390a261157c61156b611563610879565b925a90611ada565b63ffffffff60408401511690610ee9565b61158960e0860186610931565b60288082029250820403610ef6576115a76109a2916115ad93610ee9565b94610963565b42106116d757506001600160601b035f5b60646115f06115cf60a08801610975565b9261ffff6110ea6110e460808b0199886115e88c610975565b981690611c5b565b048183168111156116c857505b1691829182611691575b506116196001600160601b0391610975565b1603906001600160601b038211610ef6577f6e0bf5d63c3f7a2413c6b75b6c433a644fe461c40b415877f8f7ecf08697b18f926001600160601b0360409316908161166d575b5082519182526020820152a2565b61167961167e91610619565b610665565b611689828254610ee9565b90555f61165f565b90915f80808093855af16116a3610d8a565b50156116b157908291611607565b9050630e21dcbb60e11b5f5260045260245260445ffd5b6116d29150611d8e565b6115fd565b61ffff6001600160601b039151166115be565b6116f58b8589611dd0565b611532565b9250600160208301351660020180600211610ef6575f602091604051908382019060ff60f81b9060f81b168152853560218301526021825261173d604183610705565b61177c60016022604051809488820196607f60f91b8852600360f81b60218401525180918484015e810187838201520301601e19810184520182610705565b604051918291518091835e8101838152039060025afa156117c6576115527f025b8f33a41b03a003154a46303feddb0716230d10bf9260ebaf559394796d88938a955f519361152c565b6040513d5f823e3d90fd5b6117dd6117e291610619565b61069d565b805464ffffffffff19164264ffffffffff161790555f6114f1565b9091929394955061180d8a610963565b64ffffffffff811663ffffffff811161184c575063ffffffff60c81b1990911660c89190911b63ffffffff60c81b16179055899392919060025f6114e7565b6306dfcc6560e41b5f52602060045260245260445ffd5b61186c82610619565b63089858e760e11b5f9081526001600160a01b0391909116600452602490fd5b61189582610619565b63f517438960e01b5f9081526001600160a01b0391909116600452602490fd5b6001600160401b03165f527fb030fd56553f4f2dae49dfdc45a72f7c3f0ffc51b5ce5d63ba0b79f996fa9ec760205260405f2090565b64ffffffffff16601e8101809111610ef65790565b8161191b915f61191561018160208401610908565b55610b08565b80611959575b6119285750565b61ffff815460e81c16908115610ef657805461ffff60e81b19165f1990920160e81b61ffff60e81b16919091179055565b5061ffff815460e81c161515611921565b6001600160a01b0381165f8181525f516020611f355f395f51905f526020526040902080549192909160f81c600381101561106c57600103610ac7577f14b24d32f1736b6a91317193e445446389c4b593b1215b0da357d563ae6c1e5f91611a07826119d7602094611b17565b5f8681525f516020611f355f395f51905f5285526040902080546001600160f81b0316600160f91b17905561069d565b805464ffffffffff19164264ffffffffff16179055546040519485526001600160a01b031693a3565b9060418303611abc57826020116100cf57803591836040116100cf5760208201359360401015610298577f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411611ab4576020935f9360406080948151948552013560f81c868401526040830152606082015282805260015afa156117c6575f5190565b505050505f90565b5050505f90565b8035159081611ad0575090565b6020915001351590565b91908203918211610ef657565b5f516020611f555f395f51905f5254811015610298575f516020611f555f395f51905f525f5260205f2001905f90565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7696020526040902063ffffffff9054165f516020611f555f395f51905f52545f198101908111610ef657808203611bd1575b50505f516020611f555f395f51905f52548015611bbd575f1901611b9981611ae7565b81549060018060a01b039060031b1b191690555f516020611f555f395f51905f5255565b634e487b7160e01b5f52603160045260245ffd5b611bdd611c4791611ae7565b905460039190911b1c6001600160a01b0316611bf883611ae7565b81546001600160a01b0360039290921b82811b199091169084901b17909155165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7696020526040902090565b9063ffffffff198254161790555f80611b76565b81810292918115918404141715610ef657565b61ffff166064019061ffff8211610ef657565b8115611c8b570690565b634e487b7160e01b5f52601260045260245ffd5b905f516020611f555f395f51905f5254918215611d7f57826001600160401b03611cc99216611c81565b5f905b838210611ce25763141a589360e21b5f5260045ffd5b611ceb81611ae7565b905460039190911b1c6001600160a01b03165f8181525f516020611f355f395f51905f5260205260409020805460e81c61ffff16906101f48210611d4b5750505060018101809111610ef657611d4384600192611c81565b910190611ccc565b925061ffff9194955080935014610ef657805461ffff60e81b191660019290920160e81b61ffff60e81b1691909117905590565b636eb533ef60e11b5f5260045ffd5b6001600160601b038111611da8576001600160601b031690565b6306dfcc6560e41b5f52606060045260245260445ffd5b3563ffffffff811681036100cf5790565b9190611ddb82610619565b90813b15610ac75760c083611df660e0611e3b960182610931565b611e2d604097929751978892602084019763e59646ff60e01b89528b60248601526044850152606060648501526084840191611415565b03601f198101875286610705565b01611e4581611dbf565b643fffffffc063ffffffff82169160061b169080820460401490151715610ef657603f9004620138808101809111610ef657805a10611f1e5750915f92918363ffffffff611e938295611dbf565b16926060965193f11580611ee8575b611eaa575050565b611ee37fc516ed2c8da59d8ee3f3a13b91d2e92747ab6bedd57a3fb5dad0032fa9a329a091604051918291602083526020830190610d66565b0390a2565b3d91506101008211611f14575b60405191601f19603f82011683016040528083525f602084013e611ea2565b6101009150611ef5565b5a632d6868f160e01b5f5260045260245260445ffdfe7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7637103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b764a26469706673582212200a013e729750253ddee21870bdda9bf16b2bc314607808c7a33324bddc05960664736f6c63430008240033';

export const nodesFacetAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AccessControl__Unauthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AttestationRejected',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'until',
        type: 'uint256',
      },
    ],
    name: 'ChallengeWindowOpen',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'held',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'requested',
        type: 'uint256',
      },
    ],
    name: 'InsufficientSlashedStake',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'NodeAlreadyRegistered',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'NodeNotActive',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'NodeNotExiting',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'NotOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnverifiableKey',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sent',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'required',
        type: 'uint256',
      },
    ],
    name: 'WrongStake',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'NodeExitRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stake',
        type: 'uint256',
      },
    ],
    name: 'NodeRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'SlashedStakeWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stake',
        type: 'uint256',
      },
    ],
    name: 'StakeWithdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'activeNodeCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'activeNodes',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'exitedAtOf',
    outputs: [
      {
        internalType: 'uint40',
        name: '',
        type: 'uint40',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'node',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'registeredAt',
            type: 'uint40',
          },
          {
            internalType: 'uint32',
            name: 'lastFulfilledAssignedAt',
            type: 'uint32',
          },
          {
            internalType: 'uint16',
            name: 'pending',
            type: 'uint16',
          },
          {
            internalType: 'enum NodeStatus',
            name: 'status',
            type: 'uint8',
          },
        ],
        internalType: 'struct Nodes.Node',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'publicKeyOf',
    outputs: [
      {
        internalType: 'uint256[2]',
        name: '',
        type: 'uint256[2]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'publicKey',
        type: 'uint256[2]',
      },
      {
        internalType: 'bytes',
        name: 'attestation',
        type: 'bytes',
      },
    ],
    name: 'registerNode',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'requestExit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slashedStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'stakeOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawSlashedStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const nodesFacetBytecode: Hex =
  '0x60808060405234601557610eb2908161001a8239f35b5f80fdfe6080806040526004361015610012575f80fd5b5f3560e01c90816307f1965114610af55750806328cb1e381461094d5780632eb1ef5c1461091a57806342623360146108ee5780634a4c84d3146107d85780635e8af8d21461074a5780637534081514610721578063788fa386146106e5578063a26fd1c314610312578063bffbe61c1461020c5763c23a5cea14610095575f80fd5b34610208576020366003190112610208576100ae610bb5565b6100b781610ce9565b5460f81c60038110156101f4576002036101d45764ffffffffff6100da82610c41565b54166201518081018091116101c05780421061019e57506100fa81610c79565b546001600160a01b0382165f8181525f516020610e3d5f395f51905f52602052604081208190559192909161012e82610c79565b5561013881610cb1565b5f5b6002811061019157505061014d90610c41565b805464ffffffffff191690556101638233610d2e565b6040519182527fb7c918e0e249f999e965cafeb6c664271b3f4317d296461500e71da39f0cbda360203393a3005b5f8282015560010161013a565b63759dfc1560e01b5f9081526001600160a01b03909216600452602452604490fd5b634e487b7160e01b5f52601160045260245ffd5b6364f5c6e160e01b5f9081526001600160a01b0391909116600452602490fd5b634e487b7160e01b5f52602160045260245ffd5b5f80fd5b3461020857602036600319011261020857610225610bb5565b5f608060405161023481610bcb565b828152826020820152826040820152826060820152015260018060a01b03165f525f516020610e3d5f395f51905f5260205260405f206040519061027782610bcb565b5460018060a01b03811682526020820164ffffffffff8260a01c168152604083019163ffffffff8160c81c168352606084019061ffff8160e81c16825260f81c91608085019360038410156101f45764ffffffffff63ffffffff9261ffff9587526040519760018060a01b039051168852511660208701525116604085015251166060830152519060038210156101f45760a0916080820152f35b606036600319011261020857366044116102085760443567ffffffffffffffff811161020857366023820112156102085780600401359067ffffffffffffffff82116102085736602483830101116102085761036c610d99565b156106d6577f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6b548034036106c057508160209160245f60a460018060a01b037f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c5416936040519788968795869363771afe0160e11b855233600486015260406004838701376080606486015282608486015201848401378181018301849052601f01601f191681010301925af19081156106b5575f9161067a575b501561066b57604051602081016004358152602435604083015260408252610450606083610be7565b905190206001600160a01b03165f8181525f516020610e3d5f395f51905f52602052604090205460f81c60038110156101f4576106595760405161049381610bcb565b3381526020810164ffffffffff4216815260408201905f8252606083015f8152608084019260018452855f525f516020610e3d5f395f51905f5260205260405f209460018060a01b039051169285549064ffffffffff60a01b905160a01b169163ffffffff60c81b905160c81b169261ffff60e81b905160e81b169361ffff60e81b199162ffffff60e81b16171617171782555160038110156101f45781546001600160f81b031660f89190911b6001600160f81b0319161790555f516020610e5d5f395f51905f525463ffffffff9081169061056f83610c09565b911663ffffffff198254161790555f516020610e5d5f395f51905f52546801000000000000000081101561064557816105bd8260016105e194015f516020610e5d5f395f51905f5255610df8565b81546001600160a01b0393841660039290921b91821b9390911b1916919091179055565b346105eb82610c79565b556105f581610cb1565b60045f5b600281106106315783604051903482527ff22e9632bbbe87913fdb2f413389be6b979d648eebfe4dc4d1c9fa2b14b84d6060203393a3005b6001906020833593019281850155016105f9565b634e487b7160e01b5f52604160045260245ffd5b63295548e560e01b5f5260045260245ffd5b638614ce0960e01b5f5260045ffd5b90506020813d6020116106ad575b8161069560209383610be7565b81010312610208575180151581036102085781610427565b3d9150610688565b6040513d5f823e3d90fd5b630239dc1360e61b5f523460045260245260445ffd5b63798be76760e01b5f5260045ffd5b34610208575f3660031901126102085760207f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b76854604051908152f35b34610208575f3660031901126102085760205f516020610e5d5f395f51905f5254604051908152f35b3461020857602036600319011261020857610763610bb5565b61077e6040918280516107768282610be7565b369037610cb1565b8151905f825b600282106107c2575050506107998282610be7565b8151905f825b600282106107ac57505050f35b602080600192855181520193019101909161079f565b6001602081928554815201930191019091610784565b34610208576040366003190112610208576107f1610bb5565b335f9081527f66284c0762af713e202e0524bbf74efcdaa2baaf6286c0a3c4935fba6071c33160205260409020546024359190156108d7577f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b768548083116108c0578281039081116101c0577f52fec009a7bb363351e19fc7928d085c142e7a33b3d503de4dab2aa393f9ad77916020917f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b768556108ad8482610d2e565b6040519384526001600160a01b031692a2005b9050633b7202ef60e21b5f5260045260245260445ffd5b630c4705d560e01b5f525f6004523360245260445ffd5b3461020857602036600319011261020857602061091161090c610bb5565b610c79565b54604051908152f35b3461020857602036600319011261020857602064ffffffffff61094361093e610bb5565b610c41565b5416604051908152f35b3461020857602036600319011261020857610966610bb5565b61096f81610ce9565b5460f81c60038110156101f457600103610ad55763ffffffff61099182610c09565b54165f516020610e5d5f395f51905f52545f1981019081116101c057808203610a8b575b50505f516020610e5d5f395f51905f52548015610a77575f19016109d881610df8565b81546001600160a01b0360039290921b82901b19169091555f516020610e5d5f395f51905f529190915581165f8181525f516020610e3d5f395f51905f526020526040902080546001600160f81b0316600160f91b17905590610a3a90610c41565b805464ffffffffff19164264ffffffffff1617905533907f25506670d438786dfea1245a3c94cb6d555e9d58ffabbc37e8bd84cce342e4985f80a3005b634e487b7160e01b5f52603160045260245ffd5b610ac0610a9c63ffffffff92610df8565b905460039190911b1c6001600160a01b0316610abb816105bd86610df8565b610c09565b911663ffffffff1982541617905581806109b5565b6303398f4160e51b5f9081526001600160a01b0391909116600452602490fd5b34610208575f366003190112610208575f516020610e5d5f395f51905f5254908181526020810180925f516020610e5d5f395f51905f525f5260205f20905f5b818110610b965750505081610b4b910382610be7565b604051918291602083019060208452518091526040830191905f5b818110610b74575050500390f35b82516001600160a01b0316845285945060209384019390920191600101610b66565b82546001600160a01b0316845260209093019260019283019201610b35565b600435906001600160a01b038216820361020857565b60a0810190811067ffffffffffffffff82111761064557604052565b90601f8019910116810190811067ffffffffffffffff82111761064557604052565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7696020526040902090565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7676020526040902090565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7656020526040902090565b6001600160a01b03165f9081527f7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7666020526040902090565b6001600160a01b039081165f8181525f516020610e3d5f395f51905f52602052604090208054909392163303610d1c5750565b633b63649d60e11b5f5260045260245ffd5b5f80808085855af13d15610d94573d67ffffffffffffffff81116106455760405190610d64601f8201601f191660200183610be7565b81525f60203d92013e5b15610d77575050565b630e21dcbb60e11b5f5260018060a01b031660045260245260445ffd5b610d6e565b60243560043570014551231950b75fc4402da1732fc9bebe198110801590610de8575b610de2576401000003d019906007908290818180090908906401000003d0199080091490565b50505f90565b506401000003d019821015610dbc565b5f516020610e5d5f395f51905f5254811015610e28575f516020610e5d5f395f51905f525f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffdfe7103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b7637103b4d0a53003ec91f983abf6fa980e867f1e66bd497d2fb88c0b44a170b764a264697066735822122037b8932e7f48c8d005c1974a1f8a50f55ccee1f1b72d53d53bd6e77c4d8450c064736f6c63430008240033';

export const balancesFacetAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TransferFailed',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const balancesFacetBytecode: Hex =
  '0x608080604052346015576102b5908161001a8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c806370a0823114610206578063f340fa01146101945763f3fef3a31461003a575f80fd5b3461019057604036600319011261019057610053610249565b60243590335f525f5160206102605f395f51905f5260205260405f20548083116101755782810390811161016157335f525f5160206102605f395f51905f5260205260405f20555f80808085855af13d1561015c573d67ffffffffffffffff81116101485760405190601f8101601f19908116603f0116820167ffffffffffffffff8111838210176101485760405281525f60203d92013e5b1561012b576040519182526001600160a01b03169033907fd1c19fbcd4551a5edfb66d43d2e337c04837afda3482b42bdf569a8fccdae5fb90602090a3005b630e21dcbb60e11b5f5260018060a01b031660045260245260445ffd5b634e487b7160e01b5f52604160045260245ffd5b6100ec565b634e487b7160e01b5f52601160045260245ffd5b905063db42144d60e01b5f523360045260245260445260645ffd5b5f80fd5b6020366003190112610190576001600160a01b036101b0610249565b16805f525f5160206102605f395f51905f5260205260405f208054903482018092116101615755604051903482527f8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a760203393a3005b346101905760203660031901126101905761021f610249565b60018060a01b03165f525f5160206102605f395f51905f52602052602060405f2054604051908152f35b600435906001600160a01b03821682036101905756fe20d409567c11d0919b4e92edadabde986fedc1be9872cbd35d9bd2797c19df01a26469706673582212203ae267ea67fb24b8a8bceb48d2a60f59254303d14787f01c3b1413cf180eb80f64736f6c63430008240033';

export const configFacetAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AccessControl__Unauthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AdminSelfRemoval',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EnumerableSet__IndexOutOfBounds',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPricing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'maxCallbackGasLimit',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'max',
        type: 'uint32',
      },
    ],
    name: 'MaxCallbackGasLimitTooHigh',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'fulfillmentOverheadGas',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'fulfillmentSettlementGas',
        type: 'uint32',
      },
    ],
    name: 'OverheadBelowSettlementGas',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'premiumPercent',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'max',
        type: 'uint16',
      },
    ],
    name: 'PremiumTooHigh',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'VerifierWithoutCode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroNodeStake',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'attestationVerifier',
    outputs: [
      {
        internalType: 'contract IEnclaveAttestationVerifier',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ecvrfVerifier',
    outputs: [
      {
        internalType: 'contract IECVRFVerifier',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nodeStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pricing',
    outputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'premiumPercent',
            type: 'uint16',
          },
          {
            internalType: 'uint32',
            name: 'fulfillmentOverheadGas',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'fulfillmentSettlementGas',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'defaultCallbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'maxCallbackGasLimit',
            type: 'uint32',
          },
        ],
        internalType: 'struct Config.Pricing',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IEnclaveAttestationVerifier',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'setAttestationVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IECVRFVerifier',
        name: 'verifier',
        type: 'address',
      },
    ],
    name: 'setEcvrfVerifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'stake',
        type: 'uint256',
      },
    ],
    name: 'setNodeStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint16',
            name: 'premiumPercent',
            type: 'uint16',
          },
          {
            internalType: 'uint32',
            name: 'fulfillmentOverheadGas',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'fulfillmentSettlementGas',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'defaultCallbackGasLimit',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'maxCallbackGasLimit',
            type: 'uint32',
          },
        ],
        internalType: 'struct Config.Pricing',
        name: 'next',
        type: 'tuple',
      },
    ],
    name: 'setPricing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const configFacetBytecode: Hex =
  '0x60808060405234601557610b5c908161001a8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f5f3560e01c8063248a9ca3146108255780632f2ff15d1461071a5780633c36ccb614610541578063611a212e146105045780637ce914111461044057806382f6f608146103a55780638bb9c5bf146103875780639010d07c1461031957806391d14854146102c2578063a9b90c9714610223578063b4b3c5a0146101db578063ca15c873146101a5578063d547741f14610160578063de44e94a146101185763f73ad1ee146100bf575f80fd5b34610115576020366003190112610115576004356100db610907565b8015610106577f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6b5580f35b631d87408560e31b8252600482fd5b80fd5b50346101155780600319360112610115577f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d546040516001600160a01b039091168152602090f35b5034610115576101a261017236610864565b9061019d610198825f525f516020610b075f395f51905f52602052600260405f20015490565b610953565b6109ca565b80f35b503461011557602036600319011261011557604060209160043581525f516020610b075f395f51905f5283522054604051908152f35b50346101155780600319360112610115577f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c546040516001600160a01b039091168152602090f35b5034610115576020366003190112610115576004356001600160a01b038116908190036102be57610252610907565b6001600160a01b0390610264906109a0565b166bffffffffffffffffffffffff60a01b7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d5416177f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6d5580f35b5080fd5b50346101155761030f60209160406102d936610864565b9083525f516020610b075f395f51905f52855291206001600160a01b039091165f90815260019091016020526040902054151590565b6040519015158152f35b5034610115576040366003190112610115576024359060043581525f516020610b075f395f51905f526020526040812090815483101561037857602061035f8484610add565b905460405160039290921b1c6001600160a01b03168152f35b63e637bf3b60e01b8152600490fd5b5034610115576020366003190112610115576101a2336004356109ca565b5034610115576020366003190112610115576004356001600160a01b038116908190036102be576103d4610907565b6001600160a01b03906103e6906109a0565b166bffffffffffffffffffffffff60a01b7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c5416177f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6c5580f35b5034610115578060031936011261011557608061045b6108e7565b828152826020820152826040820152826060820152015260a061047c6108e7565b63ffffffff7f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6a548161ffff8216938481528160208201818560101c168152816040840191818760301c1683528160806060870196828a60501c168852019760701c16875260405198895251166020880152511660408601525116606084015251166080820152f35b503461011557806003193601126101155760207f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6b54604051908152f35b50346101155760a03660031901126101155761055b610907565b61056361088a565b63ffffffff8061057161089d565b1691161161070b5762d59f8063ffffffff61058a61089d565b16116106e457606461ffff61059d6108d6565b16116106c1576105ab6108b0565b63ffffffff806105b96108c3565b169116106106935761ffff6105cc6108d6565b167f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6a549065ffffffff00006105ff6108b0565b60101b169069ffffffff0000000000006106176108c3565b60301b169063ffffffff60501b61062c61088a565b60501b169263ffffffff60701b61064161089d565b60701b169463ffffffff60701b199263ffffffff60501b199169ffffffffffffffffffff1916171617161717177f932f5a960894e1533b50dc61a5ed814ad5141d345b5c48c89b71c631b170bc6a5580f35b60449063ffffffff6106a36108b0565b816106ac6108c3565b6376c534e360e01b8552911660045216602452fd5b60449061ffff6106cf6108d6565b634d7b550560e01b8352166004526064602452fd5b60449063ffffffff6106f461089d565b63bdf0b65f60e01b83521660045262d59f80602452fd5b6302b87b6760e01b8152600490fd5b346108215761072836610864565b61074d610198835f525f516020610b075f395f51905f52602052600260405f20015490565b815f525f516020610b075f395f51905f5260205260405f209060018060a01b03169061078782826001915f520160205260405f2054151590565b156107b6575b5033917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d5f80a4005b80546801000000000000000081101561080d576107f36107dd826001869401855584610add565b819391549060031b91821b915f19901b19161790565b90556001815491835f520160205260405f2055600161078d565b634e487b7160e01b5f52604160045260245ffd5b5f80fd5b3461082157602036600319011261082157602061085c6004355f525f516020610b075f395f51905f52602052600260405f20015490565b604051908152f35b604090600319011261082157600435906024356001600160a01b03811681036108215790565b60643563ffffffff811681036108215790565b60843563ffffffff811681036108215790565b60243563ffffffff811681036108215790565b60443563ffffffff811681036108215790565b60043561ffff811681036108215790565b6040519060a0820182811067ffffffffffffffff82111761080d57604052565b335f9081527f66284c0762af713e202e0524bbf74efcdaa2baaf6286c0a3c4935fba6071c33160205260409020541561093c57565b630c4705d560e01b5f525f6004523360245260445ffd5b805f525f516020610b075f395f51905f526020526109823360405f206001915f520160205260405f2054151590565b1561098a5750565b630c4705d560e01b5f526004523360245260445ffd5b803b156109aa5790565b632f19278760e11b5f9081526001600160a01b0391909116600452602490fd5b90811580610acb575b610abc57815f525f516020610b075f395f51905f5260205260405f209060018060a01b0316906001810190825f528160205260405f205480610a3b575b50505033917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b5f80a4565b610a495f1983540183610add565b90549060031b1c80610a616107dd5f19850186610add565b90555f528260205260405f205580548015610aa8575f190190610a848282610add565b8154905f199060031b1b1916905555815f526020525f604081205560015f80610a10565b634e487b7160e01b5f52603160045260245ffd5b637c35a93960e01b5f5260045ffd5b506001600160a01b03811633146109d3565b8054821015610af2575f5260205f2001905f90565b634e487b7160e01b5f52603260045260245ffdfe409a779b06f7ed4482e4a4bbaf0e0febf249036642c5bc5fb6c71bf2a72d5d00a26469706673582212202e0b416ea8405417c5bd9b0e24dc41c76bfee54ffa3465259b90234d2ea440e864736f6c63430008240033';

export const iVrfReceiverAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'requestId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'randomness',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    name: 'onRandomnessFulfilled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const iVrfReceiverBytecode: Hex = '0x';

export const ecvrfVerifierAbi = [
  {
    inputs: [],
    name: 'InvalidProof',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'publicKey',
        type: 'uint256[2]',
      },
      {
        internalType: 'uint256[4]',
        name: 'proof',
        type: 'uint256[4]',
      },
      {
        internalType: 'bytes',
        name: 'alpha',
        type: 'bytes',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: 'fulfillable',
        type: 'bool',
      },
      {
        internalType: 'bytes32',
        name: 'randomness',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const;

export const ecvrfVerifierBytecode: Hex =
  '0x608080604052346015576111ff908161001a8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c63bbe95b4c14610024575f80fd5b346100a25760e03660031901126100a257366044116100a2573660c4116100a25760c43567ffffffffffffffff81116100a257366023820112156100a257806004013567ffffffffffffffff81116100a25736602482840101116100a257602461008e92016101af565b604080519215158352602083019190915290f35b5f80fd5b634e487b7160e01b5f52604160045260245ffd5b90601f8019910116810190811067ffffffffffffffff8211176100dc57604052565b6100a6565b906100ef60405192836100ba565b565b9190604051926101026040856100ba565b8390604081019283116100a257905b82821061011d57505050565b8135815260209182019101610111565b91906040519261013e6080856100ba565b8390608081019283116100a257905b82821061015957505050565b813581526020918201910161014d565b92919267ffffffffffffffff82116100dc5760405191610193601f8201601f1916602001846100ba565b8294818452818301116100a2578281602093845f960137010152565b906101ca6101d0926101c23660046100f1565b923691610169565b9061034f565b9091156102ab5760a4359170014551231950b75fc4402da1732fc9bebe1983101561029c576102389261028a916102869181608435956102238161021b600435602435908b88610409565b96909561049b565b604435998a99929691926064359a8b9161049b565b92909161024560406100e1565b968752602087015261025760806100e1565b9687526020870152604086015260608501526102743660046100f1565b9061028036604461012d565b926104a9565b1590565b61029c57610297916105ae565b600191565b6309bde33960e01b5f5260045ffd5b50505f905f90565b805191908290602001825e015f815290565b607f60f91b8152600160f81b60018201526102ee92916102e891600201906102b3565b906102b3565b90565b634e487b7160e01b5f52601160045260245ffd5b60ff1660ff81146103165760010190565b6102f1565b61032890600293926102b3565b60f89190911b6001600160f81b03191681525f60018201520190565b6040513d5f823e3d90fd5b6103696103899161036281519160200190565b519061061f565b61037b604051938492602084016102c5565b03601f1981018352826100ba565b5f5b603260ff8216106103a05750505f905f905f90565b60205f6103c66040516103ba8161037b878988840161031b565b604051918280926102b3565b039060025afa15610404575f516103dc81610656565b6103e681836106b8565b6103fa5750506103f590610305565b61038b565b6001949193509150565b610344565b61046e9192936104666104607f483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b87f79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f8179861046095610a06565b91610a8a565b959094610a06565b6401000003d01903926401000003d019841161031657610497936401000003d019900692610957565b9091565b916104609161049793610a06565b949193929060608201805196906104e161028660408601998a51996104d081519160200190565b518a519160208c019c8d5194610795565b908115610590575b508015610563575b610558576fffffffffffffffffffffffffffffffff956105509561053061054a9680519061051f8160200190565b516040820151916060015192610728565b95909461053f82519260200190565b5192519351946108ce565b60801c90565b915191161490565b505050505050505f90565b5061058b610286885185516105788760200190565b5160408901519160608a015b5193610867565b6104f1565b6105a891506102869051865185856105848a60200190565b5f6104e9565b6105fb6105e96103ba60016105c66020965f9661061f565b604051607f60f91b88820152600360f81b602182015293849160228301906102b3565b86815203601e198101845201826100ba565b039060025afa15610404575f5190565b634e487b7160e01b5f52601260045260245ffd5b906001166002019081600211610316576040519160ff60f81b9060f81b1660208301526021820152602181526102ee6041826100ba565b61068b9063400000f4600160fe1b03906401000003d01990816007815f840908906401000003d0199081818009900908610c87565b60028101808211610316576001166106a05790565b6401000003d019036401000003d01981116103165790565b80158015610718575b8015610710575b8015610700575b6106fa576401000003d01990818180090960076401000003d0199108906401000003d0199080091490565b50505f90565b506401000003d0198210156106cf565b5081156106c8565b506401000003d0198110156106c1565b91926401000003d01903916401000003d019831161031657610497936401000003d019935f9390859006926109ba565b70014551231950b75fc4402da1732fc9bebe19039070014551231950b75fc4402da1732fc9bebe19821161031657565b9190820391821161031657565b9160ff9160209460016107c96107ae5f979a999a610758565b70014551231950b75fc4402da1732fc9bebe19900693610758565b70014551231950b75fc4402da1732fc9bebe19900691161515851461085f57601c925b60405194859460808601948370014551231950b75fc4402da1732fc9bebe1991098652168785015280604085015270014551231950b75fc4402da1732fc9bebe1991096060830152838052039060015afa156104045761084e905f5192610c1a565b6001600160a01b0390811691161490565b601b926107ec565b9293926020925f926080929091600116156108c657601c915b60ff60405193868552168684015280604084015270014551231950b75fc4402da1732fc9bebe199109606082015282805260015afa156104045761084e905f5192610c1a565b601b91610880565b6102e8946102e85f986102e861091060209c61090a6109339c6109046103ba9c6108fe60019d9c6105e99c61061f565b9b61061f565b9761061f565b9361061f565b93604051998a97607f60f91b8f8a01528960f91b60218a015260228901906102b3565b039060025afa15610404575f51806040515290565b8115610952570490565b61060b565b92909180840361099d57506401000003d0199082086109785750505f905f90565b610497915f61098e926401000003d019926110bb565b905b6401000003d01992610b86565b610497936109b4936401000003d019939291610d91565b90610990565b939493909290918083036109f65750831561095257839083086109e157505050505f905f90565b610497936109f09284926110bb565b91610b86565b61049795506109f0938593610d91565b929091926001908015610a80575f94600194869392805b610a2a5750505050929190565b60018116610a55575b905f610a4c9260011c9485946401000003d01993611131565b92909293610a1d565b93610a71908484845f9a610a4c969c6401000003d01995610f27565b90989097509094909150610a33565b5050909190600190565b919291908315158481610b75575b5080610b6d575b15610b37575f936401000003d019856001835b610ae057505050506401000003d01984800991826401000003d0199109936401000003d01992839109900990565b610aed8484999599610948565b92819261095257610b29610b14610b2f936401000003d0199087096401000003d019610788565b5f966401000003d019919008939980956111b6565b90610788565b929083610ab2565b60405162461bcd60e51b815260206004820152600e60248201526d24b73b30b634b210373ab6b132b960911b6044820152606490fd5b506001610a9f565b6401000003d019141590505f610a98565b91939291841515838682610c0f575b505080610c06575b15610b37575f9483159081856001835b610bca575050505061095257829081808780098092099509900990565b610bd784839b959b610948565b91819361095257610b2989610bf281610bfe95870982610788565b5f9708949b80946111b6565b929183610bad565b50821515610b9d565b14159050835f610b95565b6040519160208301918252604083015260408252610c396060836100ba565b905190206001600160a01b031690565b15610c5057565b60405162461bcd60e51b815260206004820152600f60248201526e4d6f64756c7573206973207a65726f60881b6044820152606490fd5b610c916001610c49565b80156106fa578115610d2857600191600160ff1b9190825b610cb35750505090565b9091926401000003d019908483161515840a906401000003d019908009096401000003d01990600185901c83161515840a9082908009096401000003d01990600285901c83161515840a9082908009096401000003d01990600385901c83161515840a9082908009099260041c919082610ca9565b5050600190565b60405190610d3e6080836100ba565b6080368337565b15610d4c57565b60405162461bcd60e51b815260206004820152601e60248201527f557365206a6163446f75626c652066756e6374696f6e20696e737465616400006044820152606490fd5b9391909492841580610f1f575b610f1357811580610f0b575b610f0057610db6610d2f565b958315610952578380938160018009808a529882808b6001099460208301958652604083018c81529a82808e6001099160608601928352610df760806100e1565b9d5190098c5251900960208a0152519009604087015251900960608401528251936040840194855114801590610eee575b610e3190610d45565b81610e3a610d2f565b9551610e47865183610788565b90088552816060850151610ee38288818060208b0195610e68875183610788565b900899602083019a8b5281808c8180808089518a5190099360408a01948552610e988286518c5190099a60600190565b998a52518009610ea9895183610788565b9008610ebf828088518651900960020983610788565b90089d51935190519009610ed38d83610788565b9008900993519051900983610788565b900894510991929190565b50602084015160608501511415610e28565b505050909190600190565b508015610daa565b90945092506001919050565b508515610d9e565b96949695939091958015806110b3575b6110a75783158061109f575b61109457610f4f610d2f565b9285156109525788948694858093818c800983528183518d0995602084019687528280604086019b81818009808e5290099160608601928352610f9260806100e1565b9b5190098a5251900960208801525190096040850152519009606082015281815195610fbe8360400190565b96875114801590611082575b610fd390610d45565b81610fdc610d2f565b9751610fe9855183610788565b90088752816060840151611075828a818060208a019561100a875183610788565b90089860208301998a5281808b8180808089518a5190099360408a0194855261103a8286518c5190099a60600190565b998a5251800961104b895183610788565b9008611061828088518651900960020983610788565b90089c51935190519009610ed38c83610788565b9008965192969509900990565b50602083015160608401511415610fca565b935050945050929190565b508115610f43565b50959450509050929190565b508215610f37565b9391939290928115610952578180858009918180808060018009998180808988096004099b80099009928009600309088286800883038381116103165783908183800908808403928484116103165784809180096008098403848111610316578460019381809681959b08900908940960020990565b90939194929480156111ae57821561095257828086800992818080808680099a8180808a88096004099c800990099280096003090891838780088403848111610316578490818580090890818503908582116103165785809180096008098503908582116103165785948580949281939b08900908940960020990565b909450919050565b818102929181159184041417156103165756fea2646970667358221220472f744a2363fd92f99dba3ecbbb97153b44c6d04ec4a801a06dee78e0d4697c64736f6c63430008240033';

export const trustedNodeEnclaveKeyVerifierAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'TrustedNodeUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'setTrustedNode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'node',
        type: 'address',
      },
    ],
    name: 'trustedNodes',
    outputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'uint256[2]',
        name: 'publicKey',
        type: 'uint256[2]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const trustedNodeEnclaveKeyVerifierBytecode: Hex =
  '0x608080604052346071573315605e575f8054336001600160a01b0319821681178355916001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a361038590816100768239f35b631e4fbdf760e01b5f525f60045260245ffd5b5f80fdfe60806040526004361015610011575f80fd5b5f3560e01c8063484fd52414610290578063715018a6146102395780638da5cb5b14610212578063ee35fc0214610124578063f2fde38b1461009f5763f62824dd1461005b575f80fd5b3461009b57602036600319011261009b576001600160a01b0361007c610313565b165f526001602052602060018060a01b0360405f205416604051908152f35b5f80fd5b3461009b57602036600319011261009b576100b8610313565b6100c0610329565b6001600160a01b03168015610111575f80546001600160a01b03198116831782556001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a3005b631e4fbdf760e01b5f525f60045260245ffd5b3461009b57608036600319011261009b5761013d610313565b3660641161009b5760643567ffffffffffffffff811161009b573660238201121561009b57806004013567ffffffffffffffff811161009b573691016024011161009b5760405160208101916024358352604435604083015260408252606082019180831067ffffffffffffffff8411176101fe576040839052519092206020926001600160a01b0390811680151592909116826101de575b505015158152f35b5f9081526001855260409020546001600160a01b031614905083806101d6565b634e487b7160e01b5f52604160045260245ffd5b3461009b575f36600319011261009b575f546040516001600160a01b039091168152602090f35b3461009b575f36600319011261009b57610251610329565b5f80546001600160a01b0319811682556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a3005b3461009b57604036600319011261009b576102a9610313565b6024356001600160a01b038116919082900361009b576102c7610329565b6001600160a01b03165f81815260016020526040812080546001600160a01b031916841790557f818e6f4aaecd439b04eded8fcca58ac3b19828c4929251379585f0696cafdab79080a3005b600435906001600160a01b038216820361009b57565b5f546001600160a01b0316330361033c57565b63118cdaa760e01b5f523360045260245ffdfea2646970667358221220150968bf8ae20acd317c5e7d7a91cdb8dc0c5879fd7014d6ae493da0aac8532964736f6c63430008240033';

/** The router seen through every facet at once: what a consumer or a node calls. */
export const verifyNetworkRouterAbi = [
  ...vrfFacetAbi,
  ...nodesFacetAbi,
  ...balancesFacetAbi,
  ...configFacetAbi,
] as const;
