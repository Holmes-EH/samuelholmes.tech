#![allow(dead_code)]

use colored::Colorize;
use core::fmt;

macro_rules! colored_print {
    (
    $sev:expr, $msg: expr
) => {
        match $sev {
            Severity::Info => println!("{} - {}", format!("[{}]", $sev).green(), $msg.green()),
            Severity::Warn => println!("{} - {}", format!("[{}]", $sev).yellow(), $msg.yellow()),
            Severity::Error => println!("{} - {}", format!("[{}]", $sev).red(), $msg.red()),
            Severity::Debug => println!("{} - {}", format!("[{}]", $sev).blue(), $msg.blue()),
        }
    };
}

pub fn log(severity: Severity, message: &str) {
    colored_print!(severity, message);
}

pub enum Severity {
    Info,
    Warn,
    Error,
    Debug,
}

impl fmt::Display for Severity {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Severity::Info => write!(f, "INFO"),
            Severity::Warn => write!(f, "WARN"),
            Severity::Error => write!(f, "ERROR"),
            Severity::Debug => write!(f, "DEBUG"),
        }
    }
}

pub fn log_info(message: impl Into<String>) {
    log(Severity::Info, &message.into());
}
pub fn log_warn(message: impl Into<String>) {
    log(Severity::Warn, &message.into());
}
pub fn log_error(message: impl Into<String>) {
    log(Severity::Error, &message.into());
}
pub fn log_debug(message: impl Into<String>) {
    log(Severity::Debug, &message.into());
}
